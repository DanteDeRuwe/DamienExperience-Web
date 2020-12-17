import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShirtSize } from '../enums.model';
import { Route } from '../models/route.model';
import { DatainjectionService } from '../services/datainjection.service';
import { RouteDataService } from '../services/route-data.service';
import { UserDataService } from '../services/user-data.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registration: FormGroup;
  routes: Route[];

  tourName: string;
  errorMessage: string = '';
  selectedSize: ShirtSize;
  price: number = 0;

  hasRegistrations: boolean = false;
  loaded: boolean = false;

  userLoaded: Promise<boolean>

  shirtSizes = Object.values(ShirtSize);

  //hash = sha1("PSPID=damiaanacties*aW2dr86U++ZaKUORDERID=3s*aW2dr86U++ZaKUAMOUNT=5s*aW2dr86U++ZaKUCURRENCY=EURs*aW2dr86U++ZaKULANGUAGE=en_USs*aW2dr86U++ZaKUEMAIL=ruben.naudts@student.hogent.bes*aW2dr86U++ZaKU")
  //CryptoJS.SHA1("PSPID=damiaanacties*aW2dr86U++ZaKUORDERID=3s*aW2dr86U++ZaKUAMOUNT=5s*aW2dr86U++ZaKUCURRENCY=EURs*aW2dr86U++ZaKULANGUAGE=en_USs*aW2dr86U++ZaKUEMAIL=ruben.naudts@student.hogent.bes*aW2dr86U++ZaKU");


  constructor(private fb: FormBuilder,
    private _rds: RouteDataService, 
    private _router: Router,
    private _uds: UserDataService,
    private translate: TranslateService,
    private _dis: DatainjectionService
  ) { }

  ngOnInit(): void {
    this.registration = this.fb.group({
      orderedShirt: ['', Validators.required],
      shirtSize: ['', Validators.required]
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

    this._rds.getRoute$(this.tourName).subscribe(route =>{
       this._rds.routeRegistration$(route.tourId, this.registration.value.orderedShirt, this.registration.value.shirtSize)
      .subscribe((val) => {
        if (val) {
          this._router.navigate(['payment'])
        } else {
          this.translate.get('smt_wrong').subscribe( val => {this.errorMessage  = val})
        }
      },
        (err: HttpErrorResponse) => {
          console.log(err);
          if (err.error instanceof Error) {//registration_error
            this.translate.get('registration_error').subscribe( val => {this.errorMessage  = val})
            //this.errorMessage = `Er ging iets mis bij het inschrijven: ${err.error.message}`
          } else {
            this.translate.get('registration_error1').subscribe( val => {this.errorMessage  = val})
            //this.errorMessage = `Error ${err.status}: Er ging iets mis bij het inschrijven. \n Gelieve alle velden in te vullen`;
          }
        }
      );
    });
  }

  getErrorMessage(errors: any) {
    var error = ""
    if (!errors) {
      return null;
    }
    if (errors.required) {
      this.translate.get('is_required').subscribe( val => { error = val})
      return error;
    }
  }
}
