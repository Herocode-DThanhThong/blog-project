import { IsNotEmpty, IsString } from 'class-validator';

export class RoleRequestPaginationDTO {
  page: string;
  limit: string;
  sort: string;
  constructor(data: any) {
    this.page = data.page || 0;
    this.limit = data.limit || 8;
    this.sort = data.sort || 'desc';
  }
}
