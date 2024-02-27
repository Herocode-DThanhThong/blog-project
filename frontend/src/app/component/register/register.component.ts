import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TYPE_MESSAGE_ERROR, TYPE_MESSAGE_SUCCESS } from '../../constants';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { RegisterResponse } from '../../response/user';
import { UserService } from '../../services/user/user.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { NotificationComponent } from '../notification/notification.component';
import { REGISTER_MESSAGE } from './../../constants/index';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    RouterLink,
    NotificationComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  password: string;
  confirmPassword: string;

  loading: boolean;
  constructor(
    private userService: UserService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.address = '';

    this.loading = true;
  }

  onRegister() {
    const registerDTO = new RegisterDTO({
      email: this.email,
      username: this.username,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
    });
    this.commonService.setIsLoading(true);
    this.userService.registerUser(registerDTO).subscribe({
      next: (response: RegisterResponse) => {
        this.notificationComponent.notify(
          TYPE_MESSAGE_SUCCESS,
          REGISTER_MESSAGE.success,
          null
        );
        this.router.navigate(['login']);
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          REGISTER_MESSAGE.error,
          error
        );
      },
    });
  }

  onPasswordChange() {
    if (this.password !== this.confirmPassword) {
      this.registerForm.form.controls['confirmPassword'].setErrors({
        passwordConfirmMatch: true,
      });
    } else {
      this.registerForm.form.controls['confirmPassword'].setErrors(null);
    }
  }
}
