import { UserDataService } from '../../services/user-data.service';
import { User } from '../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
