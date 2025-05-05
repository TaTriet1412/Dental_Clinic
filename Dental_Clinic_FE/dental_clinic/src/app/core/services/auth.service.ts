import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../share/dto/response/login-response';
import { CreateAccountReq } from '../../share/dto/request/account-create-req';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private userRole: string = 'none';
  authStatusChanged: EventEmitter<string> = new EventEmitter();

  private apiUrl = 'http://localhost:8060/auth';

  constructor(
    private http: HttpClient,
  ) {
    this.loadAuthStatus();
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
          this.saveInfoUser(res.name, res.email, res.userId)
          this.loadRole(res.role)
          this.saveAuthStatus();
          this.authStatusChanged.emit(this.userRole);
        }
      })
    );
  }

  loadRole(role: string) {
    this.userRole = role;
  }

  logout(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, { email }).pipe(
      tap(() => {
        localStorage.clear();
        this.resetDefaultUser();
      })
    );
  }

  resetDefaultUser() {
    this.userRole = 'none';
    this.saveAuthStatus();
    this.authStatusChanged.emit(this.userRole);
  }

  getUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : -1;
  }

  getAuthStatus() {
    return this.userRole !== 'none';
  }

  getDentistStatus() {
    return this.userRole === 'DENTIST';
  }

  getReceptionistStatus() {
    return this.userRole === 'RECEPTIONIST';
  }


  getAdminStatus() {
    return this.userRole === 'ADMIN';
  }

  getRole(): string {
    return this.userRole;
  }

  getEmail(): string {
    return localStorage.getItem('email')!;
  }

  getName(): string {
    return localStorage.getItem('name')!;
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
      formData, {headers});
  }

  resetPassword(userId: number) {
    return this.http.put<any>(`${this.apiUrl}/reset_password/${userId}`, {});
  }


  private saveAuthStatus() {
    localStorage.setItem('userRole', this.userRole);
  }

  private saveInfoUser(name: string, email: string, userId: number) {
    localStorage.setItem('name', name)
    localStorage.setItem('email', email)
    localStorage.setItem('userId', userId.toString())
  }

  private loadAuthStatus() {
    const savedUserRole = localStorage.getItem('userRole') as 'none' | 'RECEPTIONIST' | 'ADMIN' | 'DENTIST';
    if (savedUserRole) {
      this.userRole = savedUserRole;
      this.authStatusChanged.emit(this.userRole);
    }
  }



  ngOnDestroy(): void {
    localStorage.removeItem('userRole');
  }
}
