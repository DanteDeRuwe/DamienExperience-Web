import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Privacy, ShirtSize } from '../enums.model';
import { Route } from '../models/route.model';
import { DatainjectionService } from '../services/datainjection.service';
import { RouteDataService } from '../services/route-data.service';
import { UserDataService } from '../services/user-data.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registration: FormGroup;
  routes: Route[];
  privacySettings = Object.values(Privacy);
  privacy = Privacy;

  tourName: string;
  errorMessage: string = '';
  selectedSize: ShirtSize;
  price: number = 0;

  hasRegistrations: boolean = false;
  loaded: boolean = false;

  userLoaded: Promise<boolean>

  shirtSizes = Object.values(ShirtSize);

  constructor(private fb: FormBuilder,
    private _rds: RouteDataService, private _router: Router,
    private _uds: UserDataService,
    private _dis: DatainjectionService
  ) { }

  ngOnInit(): void {
    this.registration = this.fb.group({
      orderedShirt: ['', Validators.required],
      shirtSize: ['', Validators.required],
      privacySetting: ['', Validators.required]
    });

    this._rds.getFutureRoutes$().subscribe(routes => {
      this.routes = routes;
      this._uds.profile$.subscribe(user => {
        if(user.registrations.length != 0){
          user.registrations.forEach(registration => {
          routes.forEach(route => {
            if (route.tourId == registration.routeId)
              this.hasRegistrations = true
            })
          });
        }
        this.loaded = true;
      });
    });

    this._dis.obserervableMapData$.subscribe(data => {
      this.tourName = data[0]
    });
  }

  // onChange(value) {
  //   console.log(this.routes[value[0]].tourName)
  //   this.tourName = this.routes[value[0]].tourName
  //   console.log(this.tourName)
  // }

  onChangeShirt(selected) {
    this.selectedSize = selected.target.value;
    if (!this.selectedSize.endsWith("GEEN")) {
      this.price = 65;
    } else {
      this.price = 50;
    }
  }

  onSubmitRegistration() {
    this.registration.value.orderedShirt = true
    if (this.registration.value.shirtSize == ShirtSize.GEEN) this.registration.value.orderedShirt = false

    console.log(this.registration.value.privacySetting) //DELETE
    this._rds.getRoute$(this.tourName).subscribe(route =>{
       this._rds.routeRegistration$(route.tourId, this.registration.value.orderedShirt, this.registration.value.shirtSize, this.registration.value.privacySetting)
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
    });
  }

  getErrorMessage(errors: any) {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      return 'Dit veld is verplicht';
    }
  }
}
