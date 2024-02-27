import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  GET_CURRENT_USER_MESSAGE,
  SEND_REQUEST_CHANGE_ROLE_MESSAGE,
  TYPE_MESSAGE_ERROR,
  TYPE_MESSAGE_SUCCESS,
} from '../../constants';
import { RoleRequestDTO } from '../../dtos/request/role.request';
import { UserResponse } from '../../response/user';
import { CommonService } from '../../services/common/common.service';
import { RoleService } from '../../services/role/role.service';
import { UserService } from '../../services/user/user.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-your-request',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzAlertModule,
    FormsModule,
    NotificationComponent,
  ],
  templateUrl: './your-request.component.html',
  styleUrl: './your-request.component.css',
})
export class YourRequestComponent implements OnInit {
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;

  title: string;
  description: string;
  user: UserResponse;
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private commonService: CommonService
  ) {
    this.title = '';
    this.description = '';
    this.user = {
      username: 'string',
      password: 'string',
      email: 'string',
      firstName: 'string',
      lastName: 'string',
      address: 'string',
      avatar: 'string',
      role: 'USER',
    };
  }
  ngOnInit(): void {
    this.fetchUser();
  }

  onSendRequestChangeRoleRequest() {
    const roleRequestDTO = new RoleRequestDTO({
      title: this.title,
      description: this.description,
    });
    this.commonService.setIsLoading(true);
    this.roleService.sendRequestChangeRole(roleRequestDTO).subscribe({
      next: (response: any) => {
        this.notificationComponent.notify(
          TYPE_MESSAGE_SUCCESS,
          SEND_REQUEST_CHANGE_ROLE_MESSAGE.success,
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
          SEND_REQUEST_CHANGE_ROLE_MESSAGE.error,
          error
        );
      },
    });
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
