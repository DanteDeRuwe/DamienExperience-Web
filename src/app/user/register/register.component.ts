import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { type } from 'os';

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
    private translate: TranslateService,
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
    var error = ""
    if (!errors) {
      return null;
    }
    if (errors.required) {
      this.translate.get('is_required').subscribe( val => {error  = val})
      return error;
    } else if (errors.minlength) {
      this.translate.get('min_length',{ min: errors.minlength.requiredLength, now: errors.minlength.actualLength }).subscribe( val => {error  = val})
      return error
    } else if (errors.userAlreadyExists) {
      this.translate.get('register_userexists').subscribe( val => {error  = val})
      return error;
    } else if (errors.email) {
      this.translate.get('register_mail').subscribe( val => {error  = val})
      return error;
    } else if (errors.passwordsDiffer) {
      this.translate.get('register_password').subscribe( val => {error  = val})
      return error;
    }
  }

  translateDate(date: string) :string {
    var year = date.substring(0,4)
    var month = date.substring(5,7)
    var day = date.substring(8)
    return `${day}${month}${year}`
  }

  onSubmitRegister() {
    console.log(this.register.value.dobaAndPhoneGroup.dob)
    console.log(this.register.value.dobaAndPhoneGroup.phone)

    var date = this.translateDate(this.register.value.dobaAndPhoneGroup.dob)
    
    console.log(typeof(this.register.value.dobaAndPhoneGroup.dob))
    this._authService.register(
      this.register.value.nameGroup.firstname,
      this.register.value.nameGroup.lastname,
      date,
      this.register.value.dobaAndPhoneGroup.phone,
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
            } else {
              this._router.navigate(['about']);
            }
          } else {
            this.errorMessage = 'Could not register'
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.errorMessage = `Error while tryling to login user ${this.register.value.email}: ${err.error.message}`
          } else {
            this.errorMessage = `Error ${err.status} while trying to login user ${this.register.value.email}: ${err.error}`;
          }
        }
      )
  }

  
}
