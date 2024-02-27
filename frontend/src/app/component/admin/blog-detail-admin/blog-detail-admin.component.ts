import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDistance, subDays } from 'date-fns';
import {
  GET_DETAIL_BLOG_MESSAGE,
  TYPE_MESSAGE_ERROR,
} from '../../../constants';
import { Blog } from '../../../response/blog';
import { BlogService } from '../../../services/blog/blog.service';
import { NotificationComponent } from '../../notification/notification.component';
import { CommonService } from '../../../services/common/common.service';
import { GetDetailBlogDTO } from '../../../dtos/blog';

@Component({
  selector: 'app-blog-detail-admin',
  standalone: true,
  imports: [NotificationComponent],
  templateUrl: './blog-detail-admin.component.html',
  styleUrl: './blog-detail-admin.component.css',
})
export class BlogDetailAdminComponent {
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;
  blog: Blog;
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private commonService: CommonService
  ) {
    this.blog = {
      createdDate: '',
      updatedDate: '',
      id: 0,
      title: '',
      content: '',
      user: {
        createdDate: '',
        updatedDate: '',
        id: 0,
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        avatar: '',
        activatedAccount: true,
        role: 'USER',
      },
    };
  }

  ngOnInit(): void {
    const { params } = this.route.snapshot;
    const id = params ? params['id'] : null;
    if (id) {
      this.fetchBlogDetail(id);
    }
  }

  fetchBlogDetail(id: number) {
    const getDetailBlogDTO = new GetDetailBlogDTO({ id });
    this.commonService.setIsLoading(true);
    this.blogService.getBlogDetail(getDetailBlogDTO).subscribe({
      next: (response: Blog) => {
        this.blog = {
          ...response,
          createdDate: formatDistance(
            subDays(new Date(response.createdDate), 0),
            new Date(),
            { addSuffix: true }
          ),
          updatedDate: formatDistance(
            subDays(new Date(response.updatedDate), 0),
            new Date(),
            { addSuffix: true }
          ),
        };
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          GET_DETAIL_BLOG_MESSAGE.error,
          error
        );
      },
    });
  }
}
