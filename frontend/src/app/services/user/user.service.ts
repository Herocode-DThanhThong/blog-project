import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDTO } from '../../dtos/user/login.dto';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { enviroment } from '../../enviroment/enviroment';
import { SendEmailVerifyDTO } from '../../dtos/user/sendEmailVerify.dto';
import { VerifyAccountDTO } from '../../dtos/user/verifyAccountDTO';
import { UserResponse } from '../../response/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  constructor(private http: HttpClient) {}

  registerUser(payload: RegisterDTO): Observable<any> {
    const registerUrl = `${enviroment.baseUrl}/auth/register`;
    return this.http.post(registerUrl, payload, this.apiConfig);
  }

  loginUser(payload: LoginDTO): Observable<any> {
    const loginUrl = `${enviroment.baseUrl}/auth/login`;
    return this.http.post(loginUrl, payload, this.apiConfig);
  }

  sendEmailVerifyAccount(payload: SendEmailVerifyDTO): Observable<any> {
    const verifyAccountUrl = `${enviroment.baseUrl}/auth/resend-email-verify`;
    return this.http.post(verifyAccountUrl, payload, this.apiConfig);
  }

  verifyAccount(payload: VerifyAccountDTO): Observable<any> {
    const verifyAccountUrl = `${enviroment.baseUrl}/auth/verify-account`;
    return this.http.post(verifyAccountUrl, payload, this.apiConfig);
  }

  getMe(): Observable<UserResponse> {
    const getMeUrl = `${enviroment.baseUrl}/user/me`;
    return this.http.get<UserResponse>(getMeUrl, this.apiConfig);
  }

  getUsers(): Observable<UserResponse[]> {
    const getAllUserUrl = `${enviroment.baseUrl}/user/all`;
    return this.http.get<UserResponse[]>(getAllUserUrl, this.apiConfig);
  }
}
