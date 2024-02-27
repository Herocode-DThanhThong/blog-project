import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  LOGIN_MESSAGE,
  TYPE_MESSAGE_ERROR,
  TYPE_MESSAGE_SUCCESS,
} from '../../constants';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../response/user';
import { CommonService } from '../../services/common/common.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';
import { isAdminRole } from '../../utils';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    RouterLink,
    NotificationComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;
  username: string;
  password: string;
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.username = '';
    this.password = '';
  }
  ngOnInit(): void {}

  onLogin() {
    const loginDTO = new LoginDTO({
      username: this.username,
      password: this.password,
    });
    this.commonService.setIsLoading(true);
    this.userService.loginUser(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        // destructuring payload
        const { access_token, refresh_token } = response;
        if (!isAdminRole(access_token)) {
          this.tokenService.setToken(access_token);
          this.tokenService.setRefreshToken(refresh_token);
          // notification success
          this.notificationComponent.notify(
            TYPE_MESSAGE_SUCCESS,
            LOGIN_MESSAGE.success,
            null
          );
          // navigate to home page
          this.router.navigate(['/']);
          // set logged
          this.commonService.setIsLogged(true);
        } else {
          this.notificationComponent.notify(
            TYPE_MESSAGE_ERROR,
            LOGIN_MESSAGE.error
          );
        }
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          LOGIN_MESSAGE.error,
          error
        );
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
    });
  }
}
