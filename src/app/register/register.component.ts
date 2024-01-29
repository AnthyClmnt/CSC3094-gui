import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth-service";
import {passwordValidator, matchPasswordValidator} from "../shared/validators/password.validator";
import {Router} from "@angular/router";

@Component({
  selector: 'register',
  templateUrl: '/register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage?: string;
  showPasswordHint = false;
  submitted = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
      confPassword: ['', [Validators.required, matchPasswordValidator('password')]],
      forename: ['', [Validators.required, Validators.maxLength(16)]]
    })
  }

  closeAlert() {
    this.errorMessage = undefined;
  }

  togglePasswordHint() {
    this.showPasswordHint = !this.showPasswordHint;
  }

  showEmailRequiredError(): boolean {
    const emailControl = this.registerForm.get('email')!;
    return emailControl.hasError('required') && emailControl.touched;
  }

  showEmailFormatError(): boolean {
    const emailControl = this.registerForm.get('email')!;
    return emailControl.hasError('email') && emailControl.dirty && emailControl.touched;
  }

  showPasswordRequiredError(): boolean {
    const passwordControl = this.registerForm.get('password')!;
    return passwordControl.hasError('required') && passwordControl.touched;
  }

  showPasswordFormatError(): boolean {
    const passwordControl = this.registerForm.get('password')!;
    return (passwordControl.hasError('minlength') || passwordControl.hasError('passwordRequirements')) && passwordControl.dirty && passwordControl.touched;
  }

  showPasswordMatchError(): boolean {
    const passwordControl = this.registerForm.get('confPassword')!;
    return (passwordControl.hasError('required') || passwordControl.hasError('passwordMismatch')) && passwordControl.touched;
  }

  public formSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.forename)
        .subscribe(
          () => {
            this.submitted = false;
            this.router.navigateByUrl('/dashboard').then();
          },
          (error) => {
            this.errorMessage = error.detail;
            this.submitted = false;
          }
        );
    }
  }
}
