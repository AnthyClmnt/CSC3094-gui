import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../services/auth-service';
import { of, throwError } from 'rxjs';
import {Router} from "@angular/router";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule ],
      providers: [ FormBuilder, { provide: AuthService, useValue: authServiceSpy } ]
    })
      .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the error message to undefined when cleared', () => {
    component.errorMessage = 'error!!!!';

    expect(component.errorMessage).toEqual('error!!!!')
    component.closeAlert();

    expect(component.errorMessage).toBeUndefined();
  })

  it('should toggle password ', () => {
    component.errorMessage = 'error!!!!';

    expect(component.errorMessage).toEqual('error!!!!')
    component.closeAlert();

    expect(component.errorMessage).toBeUndefined();
  })

  it('should show required error for email when submitted with empty email', () => {
    const emailControl = component.registerForm.controls['email'];
    emailControl.setValue(undefined);
    emailControl.markAsDirty();
    emailControl.markAsTouched();

    expect(component.showEmailRequiredError()).toBeTruthy()
  });

  it('should show email format error when submitted with invalid email format', () => {
    const emailControl = component.registerForm.controls['email'];
    emailControl.setValue('invalidEmail');
    emailControl.markAsDirty();
    emailControl.markAsTouched();

    expect(component.showEmailFormatError).toBeTruthy()
  });

  it('should show required error for password when submitted with empty password', () => {
    const passwordControl = component.registerForm.controls['password'];
    passwordControl.setValue(undefined);
    passwordControl.markAsDirty();
    passwordControl.markAsTouched();

    expect(component.showPasswordRequiredError).toBeTruthy()
  });

  it('should show password length error when submitted with password less than 8 characters', () => {
    const passwordControl = component.registerForm.controls['password'];
    passwordControl.setValue('123');
    passwordControl.markAsDirty();
    passwordControl.markAsTouched();

    expect(component.showPasswordFormatError).toBeTruthy()
  });

  it('should show password mismatch error when passwords do not match', () => {
    const confPasswordControl = component.registerForm.controls['confPassword'];
    confPasswordControl.setValue('123');
    confPasswordControl.markAsDirty();
    confPasswordControl.markAsTouched();
    component.registerForm.controls['password'].setValue('1');

    expect(component.showPasswordMatchError).toBeTruthy()
  })

  it('should call authService register method with correct credentials and navigate to dashboard on successful registration', fakeAsync(() => {
    const email = 'test@example.com';
    const password = 'Password123';
    const forename = 'John';
    const navigateSpy = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    authService.register.and.returnValue(of({ accessToken: '123', refreshToken: '123'}));

    component.registerForm.controls['email'].setValue(email);
    component.registerForm.controls['password'].setValue(password);
    component.registerForm.controls['confPassword'].setValue(password);
    component.registerForm.controls['forename'].setValue(forename);
    component.formSubmit();
    tick();

    expect(authService.register).toHaveBeenCalledWith(email, password, forename);
    expect(component.submitted).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
  }));

  it('should set error message and reset form submission status on failed registration', fakeAsync(() => {
    const errorDetail = 'Registration failed';
    const email = 'test@example.com';
    const password = 'Password123';
    const forename = 'John';
    authService.register.and.returnValue(throwError({ detail: errorDetail }));

    component.registerForm.controls['email'].setValue(email);
    component.registerForm.controls['password'].setValue(password);
    component.registerForm.controls['confPassword'].setValue(password);
    component.registerForm.controls['forename'].setValue(forename);
    component.formSubmit();
    tick();

    expect(component.errorMessage).toEqual(errorDetail);
    expect(component.submitted).toBeFalse();
  }));
});
