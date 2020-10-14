import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public login: FormGroup;
  public errorMessage: string = '';

  constructor(private _authService: AuthenticationService,
    private _router: Router,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.login = this.fb.group({
      email:['', Validators.required],
      password:['', Validators.required]
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

  onSubmitLogin(){
    //TODO: login
  }
}
