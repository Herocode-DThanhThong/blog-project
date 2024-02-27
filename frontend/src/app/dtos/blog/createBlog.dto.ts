export class CreateBlogDTO {
  title: string;
  content: string;

  constructor(data: any) {
    this.content = data.content;
    this.title = data.title;
  }
}
