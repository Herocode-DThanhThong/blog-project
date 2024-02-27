import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UserService } from '../../../services/user/user.service';
import { UserResponse } from '../../../response/user';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonService } from '../../../services/common/common.service';
import {
  GET_ALL_USER_REQUEST_MESSAGE,
  TYPE_MESSAGE_ERROR,
} from '../../../constants';
import { NotificationComponent } from '../../notification/notification.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule,
    NzIconModule,
    NzButtonModule,
    NotificationComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;
  users: UserResponse[];
  constructor(
    private userService: UserService,
    private commonService: CommonService
  ) {
    this.users = [];
  }
  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.commonService.setIsLoading(true);
    this.userService.getUsers().subscribe({
      next: (res: UserResponse[]) => {
        this.users = res;
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          GET_ALL_USER_REQUEST_MESSAGE.error,
          error
        );
      },
    });
  }
}
