import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShirtSize } from '../enums.model';
import { Route } from '../map/model/route.model';
import { RouteDataService } from '../map/services/route-data.service';


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
  
  shirtSizes = Object.values(ShirtSize);

  constructor(private fb: FormBuilder,
    private _rds: RouteDataService, private _router: Router,
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

      console.log(`orderedShirt: ${this.registration.value.orderedShirt}`)
    // console.log(this.registration.value.route.tourId)
    // console.log(this.registration.value.shirtSize)
    // console.log(this.registration.value.orderedShirt)


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
