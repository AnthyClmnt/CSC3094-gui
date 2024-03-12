import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth-service";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage?: string;
  submitted = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  closeAlert() {
    this.errorMessage = undefined;
  }

  showEmailRequiredError(): boolean {
    const emailControl = this.loginForm.get('email')!;
    return emailControl.hasError('required') && emailControl.dirty && emailControl.touched;
  }

  showEmailFormatError(): boolean {
    const emailControl = this.loginForm.get('email')!;
    return emailControl.hasError('email') && emailControl.dirty && emailControl.touched;
  }

  showPasswordRequiredError(): boolean {
    const passwordControl = this.loginForm.get('password')!;
    return passwordControl.hasError('required') && passwordControl.dirty && passwordControl.touched;
  }

  showPasswordLengthError(): boolean {
    const passwordControl = this.loginForm.get('password')!;
    return passwordControl.hasError('minlength') && passwordControl.dirty && passwordControl.touched;
  }

  public formSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
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
