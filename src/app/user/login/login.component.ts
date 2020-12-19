import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
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
    private _router: Router, private translate: TranslateService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.login = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  getErrorMessage(errors: any) : string {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      var error = ""
      this.translate.get('is_required').subscribe( val => {error = val}) ;
      return error //'is required';
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
             
            } else {
              this._router.navigate(['about']);
            }
          } else {
            this.translate.get('login_failed').subscribe( val => {this.errorMessage  = val})
          }
        },
        (err: HttpErrorResponse) => {
          
          if (err.error instanceof Error) { //login_error
            this.translate.get('login_failed').subscribe( val => {this.errorMessage  = val + ` ${this.login.value.email}`})
          } else {
            this.translate.get('login_failed').subscribe( val => {this.errorMessage  = val + ` ${this.login.value.email}`})
          }             
        }
      )
  }
}
