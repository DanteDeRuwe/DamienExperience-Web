import { UserDataService } from '../user-data.service';
import { User } from '../user.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public credentials: FormGroup;
  public changePassword: FormGroup;
  public credErr: string = '';
  public passErr: string = '';

  public user: User;

  constructor(
    private _uds: UserDataService,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this._uds.profile$.subscribe((user: User) => {
      console.log(user);
      this.user = user;
    });

    this.credentials = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  changeCredentials(){
    console.log('submit')
    console.log(this.user)
   
    //this._uds.changeCredentials(temp);
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
}
