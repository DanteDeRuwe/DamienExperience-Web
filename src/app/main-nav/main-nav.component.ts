import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../user/authentication.service';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  constructor(
    //private _authenticationService: AuthenticationService,
    private _router: Router) { }

  register(){
    this._router.navigate(['register']);
  }

}
