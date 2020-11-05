import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShirtSize } from '../enums.model';
import { Route } from '../map/model/route.model';
import { RouteDataService } from '../map/services/route-data.service';
import { UserDataService } from '../user/user-data.service';
import { User } from '../user/user.model';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registration: FormGroup;
  routes: Route[];

  tourName: string;
  userName: string;
  errorMessage: string = '';
  selectedSize: ShirtSize;
  price: number = 0;
  user: User;

  userLoaded: Promise<boolean>

  shirtSizes = Object.values(ShirtSize);

  constructor(private fb: FormBuilder,
    private _rds: RouteDataService, private _router: Router,
    private _uds: UserDataService
  ) { }

  ngOnInit(): void {
    this.registration = this.fb.group({
      route: ['', Validators.required],
      orderedShirt: ['', Validators.required],
      shirtSize: ['', Validators.required]
    });

    this._rds.getFutureRoutes$().subscribe(routes => {
      console.log(routes);
      this.routes = routes;
    });

    this._uds.profile$.subscribe(u => {
      this.user = u;
      this.userLoaded = Promise.resolve(true);
    }
    )
  }

  onChange(value) {
    //console.log(this.routes[value[0]])
    //console.log(this.routes[value[0]].tourName)
    // console.log(this.tourname)
    // console.log(this.username)
    // this.tourName = this.routes[value[0]].tourName
    this.tourName = "RouteZero";
  }

  onChangeShirt(selected) {
    this.selectedSize = selected.target.value;

    console.log(this.selectedSize)
    console.log(this.selectedSize.endsWith("GEEN"));
    if (!this.selectedSize.endsWith("GEEN")) {
      this.price = 65;
    } else {
      this.price = 50;
    }
  }

  onSubmitRegistration() {
    this.registration.value.orderedShirt = true
    if (this.registration.value.shirtSize == ShirtSize.GEEN)
      this.registration.value.orderedShirt = false

    console.log(this.user.registrations)
    console.log(this.routes)

    console.log(`user already registered: ${this.alreadyRegistered()}`)




    this._rds.routeRegistration$(this.registration.value.route.tourId, this.registration.value.orderedShirt, this.registration.value.shirtSize)
      .subscribe((val) => {
        if (val) {
          if (this._rds.redirectUrl) {
            this._router.navigateByUrl(this._rds.redirectUrl);
            this._rds.redirectUrl = undefined;

          } else {
            this._router.navigate(['about']);
          }
        } else {
          this.errorMessage = 'Er ging iets mis...'
        }
      },
        (err: HttpErrorResponse) => {
          console.log(err);
          if (err.error instanceof Error) {
            this.errorMessage = `Er ging iets mis bij het inschrijven: ${err.error.message}`
          } else {
            this.errorMessage = `Error ${err.status}: Er ging iets mis bij het inschrijven. \n Gelieve alle velden in te vullen`;
          }
        }
      );

  }

  async alreadyRegistered$():Promise<any> {
    return this.alreadyRegistered();
  }

  alreadyRegistered(): boolean {

    var ret = false;
    var registrationLength = this.user.registrations.length;

    console.log("START")
    console.log(this.user)

    console.log(registrationLength)
    if (this.user.registrations.length == 0)
      return false

    this.user.registrations.forEach(registration => {
      console.log(`registration: ${registration.routeId}`)
      this.routes.forEach(route => {
        console.log(`route: ${route.tourId}`)
        if (route.tourId == registration.routeId)
          ret = true

      })
    })
    console.log("STOP")

    return ret
  }

  getErrorMessage(errors: any) {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      return 'Dit veld is verplicht';
    }
  }

  get tourname() {
    return this.tourName;
  }

  get username() {
    return this.userName
  }
}
