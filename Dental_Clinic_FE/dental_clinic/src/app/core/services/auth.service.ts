import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../share/dto/response/login-response';
import { CreateAccountReq } from '../../share/dto/request/account-create-req';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authStatusChanged: EventEmitter<string> = new EventEmitter();

  private apiUrl = 'http://localhost:8060/auth';

  constructor(
    private http: HttpClient,
  ) {
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string {
    return localStorage.getItem('auth_token')!
  }

  login(userId: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/login", { userId, password }).pipe(
      tap((response) => {
        const res = response['result'] as LoginResponse;

        if (res.token) {
          this.saveToken(res.token);
        }
      })
    );
  }

  logout(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, { email }).pipe(
      tap(() => {
        localStorage.clear();
      })
    );
  }

  public getTokenPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, '=');

      const jsonPayload = decodeURIComponent(
        escape(window.atob(base64))
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  isTokenValid(): boolean {
    const payload = this.getTokenPayload();
    if (!payload || !payload.exp) {
      return false;
    }
    const expiration = payload.exp * 1000;
    const currentTime = Date.now();
    if (currentTime > expiration) {
      this.resetDefaultUser();
      return false;
    }
    return true;
  }

  getUserRole(): string {
    const payload = this.getTokenPayload();
    return payload && payload.role ? payload.role : 'none';
  }

  getUserId(): number {
    const payload = this.getTokenPayload();
    return payload && payload.id ? Number(payload.id) : -1;
  }

  getEmail(): string {
    const payload = this.getTokenPayload();
    return payload && payload.email ? payload.email : '';
  }

  getName(): string {
    const payload = this.getTokenPayload();
    return payload && payload.name ? payload.name : '';
  }

  getAuthStatus() {
    return this.isTokenValid();
  }

  resetDefaultUser() {
    localStorage.removeItem('auth_token');
  }

  getUserStatus(role: string): boolean {
    return this.getUserRole() === role;
  }

  toggleBanUser(userId: number) {
    return this.http.put<any>(`${this.apiUrl}/toggle_ban/${userId}`, {});
  }

  createAccount(createAccountReq: CreateAccountReq) {
    return this.http.post<any>(`${this.apiUrl}/create_account`, createAccountReq);
  }

  updateAccount(updateAccountReq: any) {
    return this.http.put<any>(`${this.apiUrl}/update_account`, updateAccountReq);
  }

  uploadImg(userId: number, img: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('image', img, img.name);
    const token = this.getToken();  // Lấy JWT từ AuthService
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.apiUrl}/change-img`,
      formData, { headers });
  }

  resetPassword(userId: number) {
    return this.http.put<any>(`${this.apiUrl}/reset_password/${userId}`, {});
  }
}
