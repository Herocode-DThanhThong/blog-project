import { CommonService } from './../../services/common/common.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  TYPE_MESSAGE_ERROR,
  TYPE_MESSAGE_SUCCESS,
  VERIFY_EMAIL_MESSAGE,
} from '../../constants';
import { SendEmailVerifyDTO } from '../../dtos/user/sendEmailVerify.dto';
import { UserService } from '../../services/user/user.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    NzIconModule,
    NotificationComponent,
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
})
export class VerifyEmailComponent {
  @ViewChild('registerForm') loginForm!: NgForm;
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;

  username: string;
  constructor(
    private userService: UserService,
    private commonService: CommonService
  ) {
    this.username = '';
  }

  onSubmit() {}

  fetchSendEmailVerifyAccount() {
    const sendEmailVerifyDTO = new SendEmailVerifyDTO({
      username: this.username,
    });
    this.commonService.setIsLoading(true);
    this.userService.sendEmailVerifyAccount(sendEmailVerifyDTO).subscribe({
      next: (response: any) => {
        this.notificationComponent.notify(
          TYPE_MESSAGE_SUCCESS,
          VERIFY_EMAIL_MESSAGE.success,
          null
        );
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          VERIFY_EMAIL_MESSAGE.error,
          error
        );
      },
    });
  }
}
