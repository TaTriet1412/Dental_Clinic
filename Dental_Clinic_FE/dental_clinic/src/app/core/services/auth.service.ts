import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../share/dto/response/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private userRole: string = 'none';
  authStatusChanged: EventEmitter<string> = new EventEmitter();

  private apiUrl = 'http://localhost:8060/auth';

  constructor(
    private http: HttpClient
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
          this.saveInfoUser(res.name, res.email)
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

  private saveAuthStatus() {
    localStorage.setItem('userRole', this.userRole);
  }

  private saveInfoUser(name: string, email: string) {
    localStorage.setItem('name', name)
    localStorage.setItem('email', email)
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
