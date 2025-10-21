import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

type LoginReq = { email: string; password: string };
type SignupReq = { name: string; email: string; password: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  login(data: LoginReq) {
    return this.http.post<{ accessToken: string; user: any }>(`${this.base}/auth/login`, data);
  }

  signup(data: SignupReq) {
    return this.http.post(`${this.base}/auth/signup`, data);
  }

  forgot(email: string) {
    return this.http.post<{ message: string; devToken?: string }>(`${this.base}/auth/forgot`, { email });
  }

  saveToken(token: string) { localStorage.setItem('auth_token', token); }
  getToken() { return localStorage.getItem('auth_token'); }
  logout() { localStorage.removeItem('auth_token'); }
  isAuthenticated() { return !!this.getToken(); }

  resetpwd(token: string, newPassword: string) {
    return this.http.post<{ message: string }>(
      `${this.base}/auth/Resetpwd`,
      { token, newPassword }
      );
  }

}
