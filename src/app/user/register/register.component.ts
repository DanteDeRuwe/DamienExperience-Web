import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';

function serverSideValidateUsername(
  checkAvailabilityFn: (n: string) => Observable<boolean>
): ValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors> => {
    return checkAvailabilityFn(control.value).pipe(
      map(available => {
        if (available) {
          return null;
        }
        return { userAlreadyExists: true };
      })
    );
  };
}

function patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }
    // test the value of the control against the regexp supplied
    const valid = regex.test(control.value);
    // if true, return no error (no error), else return error passed in the second parameter
    return valid ? null : error;
  };
}

function comparePasswords(control: AbstractControl): ValidationErrors {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password.value === confirmPassword.value ? null
    : { 'passwordsDiffer': true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public user: FormGroup;
  public errorMessage: string = '';

  constructor(private _authService: AuthenticationService,
    private _router: Router,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.user = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: [
        '', [Validators.required, Validators.email],
        serverSideValidateUsername(this._authService.checkUserNameAvailability)
      ],
      passwordGroup: this.fb.group({
        password: [
          '', [
            Validators.required,
            Validators.minLength(8),
            patternValidator(/\d/, { hasNumber: true }),
            patternValidator(/[A-Z]/, { hasUpperCase: true }),
            patternValidator(/[a-z]/, { hasLowerCase: true })
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
        { validator: comparePasswords }
      )
    })
  }

  getErrorMessage(errors: any) {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      return 'is required';
    } else if (errors.minlength) {
      return `needs at least ${errors.minlength.requiredLength} characters (got ${errors.minlength.actualLength})`;
    } else if (errors.hasNumber) {
      return `needs at least 1 number`;
    } else if (errors.hasUpperCase) {
      return `needs at least 1 upper case letter`;
    } else if (errors.hasNumber) {
      return `needs at least 1 lower case letter`;
    } else if (errors.userAlreadyExists) {
      return `user already exists`;
    } else if (errors.email) {
      return `not a valid email address`;
    } else if (errors.passwordsDiffer) {
      return `passwords are not the same`;
    }
  }

  onSubmit() {
    console.log(this.user);
    this._authService.register(
      this.user.value.firstname,
      this.user.value.lastname,
      this.user.value.email,
      this.user.value.passwordGroup.password
    )
      .subscribe(
        (val) => {
          if (val) {
            if (this._authService.redirectUrl) {
              // this._router.navigateByUrl(this._authService.redirectUrl);
              // this._authService.redirectUrl = undefined;
              console.log(this.user)
            } else {
              this._router.navigate(['about']);
            }
          } else {
            this.errorMessage = 'Could not login'
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          if (err.error instanceof Error) {
            this.errorMessage = `Error while tryling to login user ${this.user.value.email}: ${err.error.message}`
          } else {
            this.errorMessage = `Error ${err.status} while trying to login user ${this.user.value.email}: ${err.error}`;
          }
        }
      )
  }
}
