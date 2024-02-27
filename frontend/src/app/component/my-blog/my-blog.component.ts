import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { formatDistance, subDays } from 'date-fns';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  DELETE_BLOG_MESSAGE,
  EDIT_BLOG_MESSAGE,
  GET_BLOG_BY_USER_MESSAGE,
  TYPE_MESSAGE_ERROR,
  TYPE_MESSAGE_SUCCESS,
} from '../../constants';
import { DeleteBlogDTO, EditBlogDTO } from '../../dtos/blog';
import { Blog, BlogEdit } from '../../response/blog';
import { BlogService } from '../../services/blog/blog.service';
import { CommonService } from '../../services/common/common.service';
import { ModalEditBlogComponent } from '../modal/modal-edit-blog/modal-edit-blog.component';
import { ModalConfirmComponent } from '../modal/model-confirm-delete-blog/modal-confirm-delete-blog.component';
import { NotificationComponent } from '../notification/notification.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-blog',
  standalone: true,
  imports: [
    CommonModule,
    NotificationComponent,
    NzIconModule,
    NzButtonModule,
    ModalEditBlogComponent,
    ModalConfirmComponent,
    RouterLink,
  ],
  templateUrl: './my-blog.component.html',
  styleUrl: './my-blog.component.css',
})
export class MyBlogComponent implements OnInit {
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;
  @ViewChild(ModalEditBlogComponent)
  modalEditComponent!: ModalEditBlogComponent;
  @ViewChild(ModalConfirmComponent)
  modalConfirmComponent!: ModalConfirmComponent;

  blogs: Array<Blog>;
  blogEdit: BlogEdit;

  constructor(
    private blogService: BlogService,
    private commonService: CommonService
  ) {
    this.blogs = [];
    this.blogEdit = {};
  }
  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.commonService.setIsLoading(true);
    this.blogService.getBlogByUser().subscribe({
      next: (response: Blog[]) => {
        this.blogs = response.map((res) => ({
          ...res,
          createdDate: formatDistance(
            subDays(new Date(res.createdDate), 0),
            new Date(),
            { addSuffix: true }
          ),
          updatedDate: formatDistance(
            subDays(new Date(res.updatedDate), 0),
            new Date(),
            { addSuffix: true }
          ),
        }));
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          GET_BLOG_BY_USER_MESSAGE.error,
          error
        );
      },
    });
  }

  clickEditBtn(blog: Blog) {
    this.modalEditComponent.data = {
      id: blog.id,
      title: blog.title,
      content: blog.content,
    };
    this.modalEditComponent.isVisible = true;
  }

  clickDeleteBtn(id: number) {
    this.modalConfirmComponent.isVisible = true;
    this.modalConfirmComponent.idBlog = id;
  }

  fetchEditBlogApi(data: BlogEdit) {
    const editBlogDTO = new EditBlogDTO({ ...data });
    this.commonService.setIsLoading(true);
    if (data.id && data.title && data.content) {
      this.blogService.editBlog(data.id, editBlogDTO).subscribe({
        next: (response: Blog) => {
          this.fetchData();
          this.notificationComponent.notify(
            TYPE_MESSAGE_SUCCESS,
            EDIT_BLOG_MESSAGE.success
          );
        },
        complete: () => {
          this.commonService.setIsLoading(false);
        },
        error: (error: any) => {
          this.commonService.setIsLoading(false);
          this.notificationComponent.notify(
            TYPE_MESSAGE_ERROR,
            EDIT_BLOG_MESSAGE.error,
            error
          );
        },
      });
    }
  }

  fetchDeleteBlogApi(id: number | null) {
    if (id) {
      const deleteBlogDTO = new DeleteBlogDTO({ id });
      this.commonService.setIsLoading(true);
      this.blogService.deleteBlog(deleteBlogDTO).subscribe({
        next: (response: Blog) => {
          this.fetchData();
          this.notificationComponent.notify(
            TYPE_MESSAGE_SUCCESS,
            DELETE_BLOG_MESSAGE.success
          );
        },
        complete: () => {
          this.commonService.setIsLoading(false);
          this.modalConfirmComponent.isVisible = false;
        },
        error: (error: any) => {
          this.commonService.setIsLoading(false);
          this.modalConfirmComponent.isVisible = false;
          this.notificationComponent.notify(
            TYPE_MESSAGE_ERROR,
            DELETE_BLOG_MESSAGE.error,
            error
          );
        },
      });
    }
  }
}
