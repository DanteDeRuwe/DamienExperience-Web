import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
  public register: FormGroup;
  public errorMessage: string = '';
  public rememberMe : boolean = false;

  constructor(private _authService: AuthenticationService,
    private _router: Router,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.register = this.fb.group({
      nameGroup: this.fb.group({
        firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      }),
      dobaAndPhoneGroup: this.fb.group({
        dob: ['', Validators.required],
        phone: ['', Validators.required]
      })
      ,
      email: [
        '', [Validators.required, Validators.email],
        serverSideValidateUsername(this._authService.checkUserNameAvailability)
      ],
      passwordGroup: this.fb.group({
        password: [
          '', [
            Validators.required,
            Validators.minLength(8)
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
    } else if (errors.userAlreadyExists) {
      return `user already exists`;
    } else if (errors.email) {
      return `not a valid email address`;
    } else if (errors.passwordsDiffer) {
      return `passwords are not the same`;
    }
  }

  onSubmitRegister() {
    this._authService.register(
      this.register.value.nameGroup.firstname,
      this.register.value.nameGroup.lastname,
      this.register.value.dobaAndPhoneGroup.birthdate,
      this.register.value.dobaAndPhoneGroup.phoneNumber,
      this.register.value.email,
      this.register.value.passwordGroup.password,
      this.register.value.passwordGroup.confirmPassword,
      this.rememberMe
    )
      .subscribe(
        (val) => {
          if (val) {
            if (this._authService.redirectUrl) {
              // this._router.navigateByUrl(this._authService.redirectUrl);
              // this._authService.redirectUrl = undefined;
              console.log(this.register)
            } else {
              this._router.navigate(['about']);
            }
          } else {
            this.errorMessage = 'Could not register'
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          if (err.error instanceof Error) {
            this.errorMessage = `Error while tryling to login user ${this.register.value.email}: ${err.error.message}`
          } else {
            this.errorMessage = `Error ${err.status} while trying to login user ${this.register.value.email}: ${err.error}`;
          }
        }
      )
  }

  
}
