import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  CREATE_BLOG_MESSAGE,
  GET_CURRENT_USER_MESSAGE,
  TYPE_MESSAGE_ERROR,
  TYPE_MESSAGE_SUCCESS,
} from '../../constants';
import { Blog } from '../../response/blog';
import { UserResponse } from '../../response/user';
import { BlogService } from '../../services/blog/blog.service';
import { CommonService } from '../../services/common/common.service';
import { UserService } from '../../services/user/user.service';
import { NotificationComponent } from '../notification/notification.component';
import { CreateBlogDTO } from '../../dtos/blog';
@Component({
  selector: 'app-create-blog',
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
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.css',
})
export class CreateBlogComponent implements OnInit {
  @ViewChild('createBlogForm') createBlogForm!: NgForm;
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;
  user: UserResponse;
  title: string;
  content: string;
  constructor(
    private blogService: BlogService,
    private userService: UserService,
    private router: Router,
    private commonService: CommonService
  ) {
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
    this.title = '';
    this.content = '';
  }
  ngOnInit(): void {
    this.fetchUser();
  }
  createBlog() {
    const createBlogDTO = new CreateBlogDTO({
      title: this.title,
      content: this.content,
    });
    this.commonService.setIsLoading(true);
    this.blogService.createBlog(createBlogDTO).subscribe({
      next: (response: Blog) => {
        this.notificationComponent.notify(
          TYPE_MESSAGE_SUCCESS,
          CREATE_BLOG_MESSAGE.success
        );
        this.content = '';
        this.router.navigate(['/']);
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          CREATE_BLOG_MESSAGE.error,
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
