import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { formatDistance, subDays } from 'date-fns';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { GET_BLOGS_MESSAGE, TYPE_MESSAGE_ERROR } from '../../constants';
import { BlogPaginationDTO } from '../../dtos/pagination/blogPagination.dto';
import { Blog, BlogResponse } from '../../response/blog';
import { BlogService } from '../../services/blog/blog.service';
import { CommonService } from '../../services/common/common.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { NotificationComponent } from '../notification/notification.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    HeaderComponent,
    FooterComponent,
    RouterLink,
    NzPaginationModule,
    NotificationComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  @ViewChild(NotificationComponent)
  notificationComponent!: NotificationComponent;
  blogs: Array<Blog>;
  searchText: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router
  ) {
    this.blogs = [];
    this.pagination = {
      page: 0,
      limit: 8,
      total: 0,
    };
    this.searchText = '';
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const { page, limit, sort, text } = params;
      this.searchText = text || '';
      this.fetchData(page - 1, limit, sort, text);
    });
  }

  fetchData(page: number, limit: number, sort: string, text: string) {
    const blogPaginationDTO = new BlogPaginationDTO({
      page,
      limit,
      sort,
      text,
    });
    this.commonService.setIsLoading(true);
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

  onPageChange(currentPage: number) {
    const { limit, sort, text } = this.route.snapshot.queryParams;
    this.searchText = text || '';
    this.fetchData(currentPage - 1, limit, sort, text);
    this.router.navigate(['/'], {
      queryParams: { page: currentPage, limit, sort, text },
    });
  }
}
