import { UserDataService } from '../../services/user-data.service';
import { User } from '../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Privacy } from 'src/app/enums.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public credentials: FormGroup;
  public changePassword: FormGroup;
  public friendForm : FormGroup;
  public credErr: string = '';
  public passErr: string = '';
  privacyOptions : string[] = []
  privacyNow : string ='';
  friends : string[] = []
  emailExists :boolean = true;
  private _oldPrivacy :number
  public user: User;

  constructor(
    private _uds: UserDataService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.privacyOptions = Object.values(Privacy);
    console.log(this.privacyOptions)
    
    this.credentials = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      privacy: ['', Validators.required],
    });
    this.friendForm= this.fb.group({
      friendEmail : ['',Validators.required]
    })
    this._uds.profile$.subscribe((user: User) => {
      console.log(user);
      this._oldPrivacy = user.privacy
      this.privacyNow = this.privacyOptions[user.privacy]
      console.log(this.privacyNow)
      this.user = user;
      this.credentials.patchValue({
        firstname: user.firstName,
        lastname: user.lastName,
        email : user.email,
        phoneNumber : user.phoneNumber,
        dateOfBirth :user.dateOfBirth,
      });
      this.friends = user.friends
    });
  }

  changeCredentials() {
    console.log('submit');
    console.log(this.user);
    var index 
    console.log(`/${this.credentials.get("privacy").value}/`)
    
    index = this.privacyOptions.indexOf(this.credentials.get("privacy").value)
    if(index<0){
      index = this._oldPrivacy
      console.log(index)
    }
    console.log(index)
    var tempUser = {
      email: this.credentials.get("email").value,
      firstName: this.credentials.get("firstname").value,
      lastName: this.credentials.get("lastname").value,
      phoneNumber: this.credentials.get("phoneNumber").value,
      dateOfBirth: this.translateDate(this.credentials.get("dateOfBirth").value),
      friends: this.friends,
      privacy: index
    }
    console.log(this.credentials.get("dateOfBirth").value)
    console.log(tempUser)
    //  console.log(tempUser)
    this._uds.changeCredentials(tempUser).subscribe();
  }

  addFriend(){
    var email = this.friendForm.get("friendEmail").value
    const nameEquals = (element) => element == email;
    var index = this.friends.findIndex(nameEquals)
    console.log(index)
    if(index<0){
      this.friends.push(email)
      console.log(this.user.friends)
      this._uds.updateFriends(this.friends).subscribe();
      this.friendForm.get("friendEmail").setValue("")
    }
    
  }
  removeFriend(i : number){
    if (i > -1) {
      this.friends.splice(i, 1);
      this._uds.updateFriends(this.friends).subscribe();
    }
  }
  //1998-06-15
  translateDate(date: string) :string {
    var year = date.substring(0,4)
    var month = date.substring(5,7)
    var day = date.substring(8)
    return `${day}${month}${year}`
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
