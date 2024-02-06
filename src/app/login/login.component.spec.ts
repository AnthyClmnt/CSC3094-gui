import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth-service';
import { of, throwError } from 'rxjs';
import {Router} from "@angular/router";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule ],
      providers: [ FormBuilder, { provide: AuthService, useValue: authServiceSpy } ]
    })
      .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show required error for email when submitted with empty email', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue(undefined);
    emailControl.markAsDirty();
    emailControl.markAsTouched();

    expect(component.showEmailRequiredError()).toBeTruthy()
    expect(emailControl.dirty).toBeTruthy();
  });

  it('should show email format error when submitted with invalid email format', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('invalidEmail');
    emailControl.markAsDirty();
    emailControl.markAsTouched();

    expect(component.showEmailFormatError).toBeTruthy()
  });

  it('should show required error for password when submitted with empty password', () => {
    const passwordControl = component.loginForm.controls['password'];
    passwordControl.setValue(undefined);
    passwordControl.markAsDirty();
    passwordControl.markAsTouched();

    expect(component.showPasswordRequiredError).toBeTruthy()
  });

  it('should show password length error when submitted with password less than 8 characters', () => {
    const passwordControl = component.loginForm.controls['password'];
    passwordControl.setValue('123');
    passwordControl.markAsDirty();
    passwordControl.markAsTouched();

    expect(component.showPasswordLengthError).toBeTruthy()
  });

  it('should call authService login method with correct credentials and navigate to dashboard on successful login', fakeAsync(() => {
    const email = 'test@example.com';
    const password = 'password123';
    const navigateSpy = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    authService.login.and.returnValue(of({ accessToken: '123', refreshToken: '123'}));

    component.loginForm.controls['email'].setValue(email);
    component.loginForm.controls['password'].setValue(password);
    component.formSubmit();
    tick();

    expect(authService.login).toHaveBeenCalledWith(email, password);
    expect(component.submitted).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
  }));

  it('should set error message and reset form submission status on failed login', fakeAsync(() => {
    const errorDetail = 'Invalid credentials';
    authService.login.and.returnValue(throwError({ detail: errorDetail }));

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    component.formSubmit();

    tick();

    expect(component.errorMessage).toEqual(errorDetail);
    expect(component.submitted).toBeFalse();
  }));

  it('should set the error message to undefined when cleared', () => {
    component.errorMessage = 'error!!!!';

    expect(component.errorMessage).toEqual('error!!!!')
    component.closeAlert();

    expect(component.errorMessage).toBeUndefined();
  })
});
