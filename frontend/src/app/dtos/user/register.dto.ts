import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDTO {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  avatar: string;
  password: string;
  constructor(data: any) {
    this.username = data.username;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.address = data.address;
    this.avatar = data.avatar || '';
    this.password = data.password;
  }
}
