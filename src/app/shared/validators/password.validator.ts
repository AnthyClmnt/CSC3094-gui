import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    // Check for at least one uppercase letter
    const hasUppercase = /[A-Z]/.test(control.value);

    // Check for at least one lowercase letter
    const hasLowercase = /[a-z]/.test(control.value);

    // Check for at least one digit (number)
    const hasNumber = /\d/.test(control.value);

    const isValid = hasUppercase && hasLowercase && hasNumber;

    return isValid ? null : { 'passwordRequirements': true };
  };
}

export function matchPasswordValidator(matchControlName: string) {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const matchControl = control.root.get(matchControlName);

    if (matchControl && control.value !== matchControl.value) {
      return {'passwordMismatch': true};
    }

    return null;
  };
}
