import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TYPE_MESSAGE_ERROR, TYPE_MESSAGE_SUCCESS } from '../../constants';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../response/user';
import { CommonService } from '../../services/common/common.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';
import { isAdminRole } from '../../utils';
import { NotificationComponent } from '../notification/notification.component';
import { LOGIN_ADMIN_MESSAGE } from './../../constants/index';
@Component({
  selector: 'app-login-admin',
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
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css',
})
export class LoginAdminComponent {
  @ViewChild('loginAdminForm') loginAdminForm!: NgForm;
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
        if (isAdminRole(access_token)) {
          // set token
          this.tokenService.setToken(access_token);
          this.tokenService.setRefreshToken(refresh_token);

          // set common
          this.commonService.setIsLogged(true);
          this.commonService.setIsAdmin(true);

          // navigate to home page
          this.router.navigate(['/admin/user']);

          // notify
          this.notificationComponent.notify(
            TYPE_MESSAGE_SUCCESS,
            LOGIN_ADMIN_MESSAGE.success
          );
        } else {
          this.notificationComponent.notify(
            TYPE_MESSAGE_ERROR,
            LOGIN_ADMIN_MESSAGE.error
          );
        }
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          LOGIN_ADMIN_MESSAGE.error,
          error
        );
      },
    });
  }
}
