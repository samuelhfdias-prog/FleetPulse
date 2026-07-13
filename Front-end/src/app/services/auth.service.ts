// Serviço de Autenticação Angular
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'USER';
  companyId: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());

  currentUser$ = this.currentUserSubject.asObservable();

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response) => {
        this.setAuthData(response.user, response.accessToken);
        this.currentUserSubject.next(response.user);
        return response;
      }),
    );
  }

  logout(): void {
    sessionStorage.removeItem(environment.tokenStorageKey);
    sessionStorage.removeItem(environment.userStorageKey);
    this.currentUserSubject.next(null);
    void this.router.navigate(['/login'], { replaceUrl: true });
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token || !this.getUserFromStorage()) return false;

    try {
      const segment = token.split('.')[1];
      const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      const payload = JSON.parse(atob(padded));
      const isValid = typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
      if (!isValid) this.clearAuthData();
      return isValid;
    } catch {
      this.clearAuthData();
      return false;
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(environment.tokenStorageKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setAuthData(user: User, token: string): void {
    sessionStorage.setItem(environment.tokenStorageKey, token);
    sessionStorage.setItem(environment.userStorageKey, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userStr = sessionStorage.getItem(environment.userStorageKey);
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr) as User;
      return user?.id && user?.email ? user : null;
    } catch {
      sessionStorage.removeItem(environment.tokenStorageKey);
      sessionStorage.removeItem(environment.userStorageKey);
      return null;
    }
  }

  private clearAuthData(): void {
    sessionStorage.removeItem(environment.tokenStorageKey);
    sessionStorage.removeItem(environment.userStorageKey);
    this.currentUserSubject.next(null);
  }
}
