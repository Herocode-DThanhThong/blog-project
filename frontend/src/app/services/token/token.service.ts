import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor() {}
  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  setToken(token: string): void {
    return localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }
  removeToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  setRefreshToken(token: string): void {
    return localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }
  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
