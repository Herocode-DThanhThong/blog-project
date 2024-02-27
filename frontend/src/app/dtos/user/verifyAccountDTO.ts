import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAccountDTO {
  token: string;
  constructor(data: any) {
    this.token = data.token;
  }
}
