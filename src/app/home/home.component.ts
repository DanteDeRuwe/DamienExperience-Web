import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../user/authentication.service';
import * as moment from 'moment';
import { min } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public loggedInUser$ = this._authenticationService.user$;

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router) { }

  ngOnInit(): void {
    this.initTimer()
  }

  initTimer(){
    var countDownDate = new Date("May 15, 2021 13:00:00").getTime();
    var x = setInterval(function() {
      var now = new Date().getTime();
      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // document.getElementById("demo").innerHTML = days + "d " + hours + "h "
      // + minutes + "m " + seconds + "s ";

      document.getElementById("days").innerHTML = `${days}`;
      document.getElementById("hours").innerHTML = `${hours}`;
      document.getElementById("minutes").innerHTML = `${minutes}`;
      document.getElementById("seconds").innerHTML = `${seconds}`;

      if (distance < 0) {
        clearInterval(x);
        document.getElementById("days").innerHTML = "EXPIRED";
        document.getElementById("hours").innerHTML = "EXPIRED";
        document.getElementById("minutes").innerHTML = "EXPIRED";
        document.getElementById("seconds").innerHTML = "EXPIRED";
      }
    }, 1000);
  }

  schrijfIn() {
    if (!this.loggedInUser$.value)
      this._router.navigate(['register']);
    else{
      console.log(this.loggedInUser$.value);
      
      this._router.navigate(['registration']);
    }
  }

}
