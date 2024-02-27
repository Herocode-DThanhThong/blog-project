import { IsNotEmpty, IsString } from 'class-validator';

export class BlogPaginationDTO {
  page: string;
  limit: string;
  sort: string;
  text: string;
  constructor(data: any) {
    this.page = data.page || 0;
    this.limit = data.limit || 8;
    this.sort = data.sort || 'desc';
    this.text = data.text || '';
  }
}
