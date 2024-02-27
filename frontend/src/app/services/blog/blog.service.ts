import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateBlogDTO,
  DeleteBlogDTO,
  EditBlogDTO,
  GetDetailBlogDTO,
} from '../../dtos/blog';
import { BlogPaginationDTO } from '../../dtos/pagination/blogPagination.dto';
import { enviroment } from '../../enviroment/enviroment';
import { Blog } from '../../response/blog';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  constructor(private http: HttpClient) {}
  getBlogs(params: BlogPaginationDTO): Observable<any> {
    const blogUrl = `${enviroment.baseUrl}/blog`;
    return this.http.get(blogUrl, { ...this.apiConfig, params: { ...params } });
  }
  getBlogDetail(params: GetDetailBlogDTO): Observable<Blog> {
    const blogDetailUrl = `${enviroment.baseUrl}/blog/${params.id}`;
    return this.http.get<Blog>(blogDetailUrl, this.apiConfig);
  }
  createBlog(payload: CreateBlogDTO): Observable<Blog> {
    const createBlogUrl = `${enviroment.baseUrl}/blog`;
    return this.http.post<Blog>(createBlogUrl, payload, this.apiConfig);
  }
  getBlogByUser(): Observable<Blog[]> {
    const blogByUserUrl = `${enviroment.baseUrl}/blog/by-user`;
    return this.http.get<Blog[]>(blogByUserUrl, this.apiConfig);
  }
  editBlog(id: number, payload: EditBlogDTO): Observable<Blog> {
    const blogEditUrl = `${enviroment.baseUrl}/blog/${id}`;
    return this.http.patch<Blog>(blogEditUrl, payload, this.apiConfig);
  }
  deleteBlog(params: DeleteBlogDTO): Observable<any> {
    const blogEditUrl = `${enviroment.baseUrl}/blog/${params.id}`;
    return this.http.delete(blogEditUrl, this.apiConfig);
  }
}
