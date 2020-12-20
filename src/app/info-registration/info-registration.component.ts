import { Component, OnInit } from '@angular/core';
import { ShirtSize } from '../enums.model';
import { Registration } from '../models/registration.model';
import { Route } from '../models/route.model';
import { RouteDataService } from '../services/route-data.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-info-registration',
  templateUrl: './info-registration.component.html',
  styleUrls: ['./info-registration.component.css']
})
export class InfoRegistrationComponent implements OnInit {

  loaded: boolean = false;
  registration: Registration;
  route: Route;
  shirtSizes = Object.values(ShirtSize);

  constructor( private _rds: RouteDataService, private _uds: UserDataService) { }

  ngOnInit(): void {

    this._rds.getFutureRoutes$().subscribe(routes => {
      var routes = routes;
      this._uds.profile$.subscribe(user => {
        if(user.registrations.length != 0){
          user.registrations.forEach(registration => {
          routes.forEach(route => {
            if (route.tourId == registration.routeId){
              this.route = route;
              this.registration = registration;
            }
            })
          });
        }
        this.loaded = true;
      });
    });

  }

}
