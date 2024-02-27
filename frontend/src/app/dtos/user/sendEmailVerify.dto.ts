import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailVerifyDTO {
  username: string;
  constructor(data: any) {
    this.username = data.username;
  }
}
