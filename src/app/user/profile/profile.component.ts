import { UserDataService } from '../../services/user-data.service';
import { User } from '../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';


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
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this._uds.profile$.subscribe((user: User) => {
      console.log(user);
      this.user = user;
    });

    this.credentials = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  changeCredentials() {
    console.log('submit');
    console.log(this.user);
    var tempUser = {
      "email": this.credentials.get("email").value,
      "firstName": this.credentials.get("firstname").value,
      "lastName": this.credentials.get("lastname").value,
      "phoneNumber": this.credentials.get("phoneNumber").value,
      "dateOfBirth": this.credentials.get("dateOfBirth").value
    }
  //  console.log(tempUser)
   this._uds.changeCredentials(tempUser).subscribe();
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
}
