import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../user-data.service';
import { User } from '../user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private _uds: UserDataService
    ) { }

  ngOnInit(): void {
    this._uds.profile$.subscribe((user: User) => {
      console.log(user);
    });
  }

}
