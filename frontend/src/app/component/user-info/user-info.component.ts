import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { GET_CURRENT_USER_MESSAGE, TYPE_MESSAGE_ERROR } from '../../constants';
import { UserResponse } from '../../response/user';
import { UserService } from '../../services/user/user.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { NotificationComponent } from '../notification/notification.component';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    NotificationComponent,
  ],
  templateUrl: './user-info.component.html',
})
export class UserInfoComponent {
  @ViewChild('userForm') userForm!: NgForm;
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;
  user: UserResponse;
  constructor(
    private userService: UserService,
    private commonService: CommonService
  ) {
    this.user = {};
  }

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser() {
    this.commonService.setIsLoading(true);
    this.userService.getMe().subscribe({
      next: (response: UserResponse) => {
        this.user = response;
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          GET_CURRENT_USER_MESSAGE.error,
          error
        );
      },
    });
  }
}
