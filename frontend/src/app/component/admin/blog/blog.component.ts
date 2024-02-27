import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { formatDistance, subDays } from 'date-fns';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { GET_BLOGS_MESSAGE, TYPE_MESSAGE_ERROR } from '../../../constants';
import { BlogPaginationDTO } from '../../../dtos/pagination/blogPagination.dto';
import { Blog, BlogResponse } from '../../../response/blog';
import { BlogService } from '../../../services/blog/blog.service';
import { NotificationComponent } from '../../notification/notification.component';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule,
    NzIconModule,
    NzButtonModule,
    NotificationComponent,
    RouterLink,
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent implements OnInit {
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;
  blogs: Array<Blog>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.blogs = [];
    this.pagination = {
      page: 0,
      limit: 8,
      total: 0,
    };
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const { page, limit } = params;
      this.fetchBlogs(page - 1, limit, '', '');
    });
  }

  fetchBlogs(page: number, limit: number, sort: string, text: string) {
    this.commonService.setIsLoading(true);
    const blogPaginationDTO = new BlogPaginationDTO({
      page,
      limit,
      sort,
      text,
    });
    this.blogService.getBlogs(blogPaginationDTO).subscribe({
      next: (response: BlogResponse) => {
        this.blogs = response.data.map((res) => ({
          ...res,
          createdDate: formatDistance(
            subDays(new Date(res.createdDate), 0),
            new Date(),
            { addSuffix: true }
          ),
        }));
        this.pagination = response.pagination;
      },
      complete: () => {
        this.commonService.setIsLoading(false);
      },
      error: (error: any) => {
        this.commonService.setIsLoading(false);
        this.notificationComponent.notify(
          TYPE_MESSAGE_ERROR,
          GET_BLOGS_MESSAGE.error,
          error
        );
      },
    });
  }
}
