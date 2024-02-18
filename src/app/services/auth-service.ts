// auth.service.ts

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, shareReplay, throwError} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {Token, UserLogin, UserRegistration} from "../shared/openapi";
import {LoadingService} from "./loading.service";
import {Router} from "@angular/router";
import {API_URL} from "../shared/constants"

export interface CachedResponse {
  data: any;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string;
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private cachedResponses: { [key: string]: CachedResponse } = {};

  constructor(private http: HttpClient, private loadingService: LoadingService, private router: Router) {
    this.apiUrl = API_URL;
  }

  public clearCache(key: string): void {
    delete this.cachedResponses[key];
  }

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
    this.loadingService.setLoading({
      active: true,
      text: 'Logging Out...',
      overlay: true
    });
    sessionStorage.removeItem(this.accessTokenKey);
    setTimeout(() => {
      this.clearCache('isAccessTokenValid')
      this.loadingService.deactivateLoading();
      this.router.navigateByUrl('/login')
    }, 500)
  }

  isAuthenticated(): Observable<boolean> {
    const cacheKey = 'isAccessTokenValid';
    const cachedData = this.cachedResponses[cacheKey];

    if (cachedData && Date.now() - cachedData.timestamp < 10000) {
      return of(cachedData.data as boolean)
    }

    const token = this.getToken()

    if (!token) {
      return of(false);
    }

    else {
      return this.http.post<boolean>(`${this.apiUrl}/auth/validate-token`, { accessToken: token, refreshToken: '' })
        .pipe(
          tap((result) => {
            this.cachedResponses[cacheKey] = { data: result, timestamp: Date.now()}

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
    const cacheKey = 'githubConnected';
    const cachedData = this.cachedResponses[cacheKey];

    if (cachedData && Date.now() - cachedData.timestamp < 30000) {
      return of(cachedData.data as boolean)
    }

    const token = this.getToken();
    return this.http.post<boolean>(`${this.apiUrl}/auth/validate-connection`, { accessToken: token, refreshToken: '' })
      .pipe(
        tap((result) => {
          this.cachedResponses[cacheKey] = { data: result, timestamp: Date.now()}
        }),
        shareReplay(1)
      )
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }
}
