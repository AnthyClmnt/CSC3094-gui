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
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<Token> {
    const credentials: UserLogin = { email, password };

    return this.http.post<Token>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        // Store the token in localStorage or a secure storage mechanism
        sessionStorage.setItem(this.accessTokenKey, response.accessToken);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
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
        sessionStorage.setItem(this.accessTokenKey, response.accessToken);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
      }),
      catchError((error) => {
        return throwError(error.error);
      })
    );
  }

  refreshAccessToken() {
    const token = this.getRefreshToken();

    return this.http.post<Token>(`${this.apiUrl}/auth/refresh-access-token`, { refreshToken: token, accessToken: '' })
      .pipe(
        tap((response) => {
          sessionStorage.setItem(this.accessTokenKey, response.accessToken);
        })
      )
  }

  logout(): void {
    // Remove the token from localStorage or your storage mechanism
    sessionStorage.removeItem(this.accessTokenKey);
    window.location.reload();
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.getToken()

    if (!token) {
      return of(false);
    }

    else {
      return this.http.post<boolean>(`${this.apiUrl}/auth/validate-token`, { accessToken: token, refreshToken: '' })
        .pipe(
          tap((result) => {
            if(!result) {
              localStorage.removeItem(this.accessTokenKey);
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

  isGithubConnected(): Observable<boolean> {
    const token = this.getToken();
    return this.http.post<boolean>(`${this.apiUrl}/auth/validate-connection`, { accessToken: token, refreshToken: '' })
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }
}
