import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public login: FormGroup;
  public errorMessage: string = '';
  public rememberMe: boolean = false;

  constructor(private _authService: AuthenticationService,
    private _router: Router,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.login = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  getErrorMessage(errors: any) {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      return 'is required';
    }
  }

  onSubmitLogin() {
    //TODO: login

    this._authService.login(
      this.login.value.email,
      this.login.value.password,
      this.rememberMe
    )
      .subscribe(
        (val) => {
          if (val) {
            if (this._authService.redirectUrl) {
              this._router.navigateByUrl(this._authService.redirectUrl);
              this._authService.redirectUrl = undefined;
              console.log(this.login)
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
            this.errorMessage = `Error while trying to login user ${this.login.value.email}: ${err.error.message}`
          } else {
            this.errorMessage = `Error ${err.status} while trying to login user ${this.login.value.email}: ${err.error}`;
          }
        }
      )
  }
}
