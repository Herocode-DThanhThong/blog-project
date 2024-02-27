import { BlogEdit } from '../../response/blog';

export class CreateBlogDTO {
  title: string;
  content: string;

  constructor(data: any) {
    this.content = data.content;
    this.title = data.title;
  }
}

export class GetDetailBlogDTO {
  id: number;

  constructor(data: any) {
    this.id = data.id;
  }
}

export class DeleteBlogDTO {
  id: number;

  constructor(data: any) {
    this.id = data.id;
  }
}

export class EditBlogDTO {
  title: string;
  content: string;

  constructor(data: any) {
    this.title = data.title;
    this.content = data.content;
  }
}
