// auth.service.ts

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, shareReplay, throwError} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {Token, UserLogin, UserRegistration} from "../shared/openapi";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<Token> {
    const credentials: UserLogin = { email, password };

    return this.http.post<Token>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        // Store the token in localStorage or a secure storage mechanism
        localStorage.setItem(this.tokenKey, response.authToken);
      }),
      catchError((error) => {
        return throwError(error.error);
      })
    );
  }

  register(email: string, password: string, forename: string): Observable<Token> {
    const userDetails: UserRegistration = {email, password, forename};

    return this.http.post<Token>(`${this.apiUrl}/auth/register`, userDetails).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.authToken);
      }),
      catchError((error) => {
        return throwError(error.error);
      })
    );
  }

  logout(): void {
    // Remove the token from localStorage or your storage mechanism
    localStorage.removeItem(this.tokenKey);
    window.location.reload();
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem(this.tokenKey);

    if (!token) {
      return of(false);
    }

    else {
      return this.http.post<boolean>(`${this.apiUrl}/auth/validate-token`, { authToken: token })
        .pipe(
          tap((result) => {
            if(!result) {
              localStorage.removeItem(this.tokenKey);
            }
          }),
          catchError((error) => {
            console.error('Token validation error:', error);
            return of(false);
          }),
          shareReplay(1)
        );
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
