import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Token, UserLogin, UserRegistration } from '../shared/openapi';
import {AuthService} from "./auth-service";
import {Router} from "@angular/router";
import {LoadingService} from "./loading.service";

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, LoadingService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    loadingService = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', () => {
    const mockToken: Token = { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
    const mockCredentials: UserLogin = { email: 'test@example.com', password: 'password' };

    service.login(mockCredentials.email, mockCredentials.password).subscribe(token => {
      expect(token).toEqual(mockToken);
      expect(sessionStorage.getItem('accessToken')).toEqual(mockToken.accessToken);
      expect(localStorage.getItem('refreshToken')).toEqual(mockToken.refreshToken);
    });

    const req = httpMock.expectOne('http://localhost:8000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockToken);
  });

  it('should register', () => {
    const mockToken: Token = { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
    const mockUserDetails: UserRegistration = { email: 'test@example.com', password: 'password', forename: 'Test' };

    service.register(mockUserDetails.email, mockUserDetails.password, mockUserDetails.forename).subscribe(token => {
      expect(token).toEqual(mockToken);
      expect(sessionStorage.getItem('accessToken')).toEqual(mockToken.accessToken);
      expect(localStorage.getItem('refreshToken')).toEqual(mockToken.refreshToken);
    });

    const req = httpMock.expectOne('http://localhost:8000/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockToken);
  });

  it('should refresh access token', () => {
    const mockToken: Token = { accessToken: 'mock-refreshed-access-token', refreshToken: 'mock-refresh-token' };

    service.refreshAccessToken().subscribe(token => {
      expect(token).toEqual(mockToken);
      expect(sessionStorage.getItem('accessToken')).toEqual(mockToken.accessToken);
    });

    const req = httpMock.expectOne('http://localhost:8000/auth/refresh-access-token');
    expect(req.request.method).toBe('POST');
    req.flush(mockToken);
  });

  it('should logout', fakeAsync(() => {
    spyOn(sessionStorage, 'removeItem');
    spyOn(loadingService, 'setLoading');
    spyOn(loadingService, 'deactivateLoading');
    spyOn(router, 'navigateByUrl');

    service.logout();

    expect(service['loadingService'].setLoading).toHaveBeenCalledWith({
      active: true,
      text: 'Logging Out...',
      overlay: true
    });
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('accessToken');

    tick(500);

    expect(service['loadingService'].deactivateLoading).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  }));

  it('should return false if no token in storage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    service.isAuthenticated().subscribe(isAuthenticated => {
      expect(isAuthenticated).toBe(false);
    });

    httpMock.expectNone('http://localhost:8000/auth/validate-token');
  });

  it('should check if the user is authenticated using cache', () => {
    const mockToken = 'mock-access-token';
    const mockResponse = true;

    spyOn(sessionStorage, 'getItem').and.returnValue(mockToken);
    service['cachedResponses']['isAccessTokenValid'] = { data: mockResponse, timestamp: Date.now() };

    service.isAuthenticated().subscribe(isAuthenticated => {
      expect(isAuthenticated).toBe(mockResponse);
    });

    httpMock.expectNone('http://localhost:8000/auth/validate-token');
  });

  it('should check if the user is authenticated using api call', () => {
    const mockToken = 'mock-access-token';
    const mockResponse = true;

    spyOn(sessionStorage, 'getItem').and.returnValue(mockToken);
    service['cachedResponses']['isAccessTokenValid'] = { data: mockResponse, timestamp: Date.now() - 60000 };

    service.isAuthenticated().subscribe(isAuthenticated => {
      expect(isAuthenticated).toBe(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8000/auth/validate-token');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should check if GitHub is connected using cache', () => {
    const mockToken = 'mock-access-token';
    const mockResponse = true;

    spyOn(sessionStorage, 'getItem').and.returnValue(mockToken);
    service['cachedResponses']['githubConnected'] = { data: mockResponse, timestamp: Date.now() };

    service.isGithubConnected().subscribe(isConnected => {
      expect(isConnected).toBe(mockResponse);
    });

    httpMock.expectNone('http://localhost:8000/auth/validate-connection');
  });

  it('should check if GitHub is connected with api call', () => {
    const mockToken = 'mock-access-token';
    const mockResponse = true;

    spyOn(sessionStorage, 'getItem').and.returnValue(mockToken);
    service['cachedResponses']['githubConnected'] = { data: mockResponse, timestamp: Date.now() - 60000 };

    service.isGithubConnected().subscribe(isConnected => {
      expect(isConnected).toBe(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8000/auth/validate-connection');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should check if GitHub is connected with api call because cache has been cleared', () => {
    const mockToken = 'mock-access-token';
    const mockResponse = true;

    spyOn(sessionStorage, 'getItem').and.returnValue(mockToken);
    service['cachedResponses']['githubConnected'] = { data: mockResponse, timestamp: Date.now() };
    service.clearCache('githubConnected');

    service.isGithubConnected().subscribe(isConnected => {
      expect(isConnected).toBe(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8000/auth/validate-connection');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get token from session storage', () => {
    const mockToken = 'mock-access-token';
    spyOn(sessionStorage, 'getItem').and.returnValue(mockToken);

    const token = service.getToken();
    expect(token).toBe(mockToken);
  });

  it('should get refresh token from local storage', () => {
    const mockToken = 'mock-refresh-token';
    spyOn(localStorage, 'getItem').and.returnValue(mockToken);

    const token = service.getRefreshToken();
    expect(token).toBe(mockToken);
  });
});
