import { Component, OnInit } from '@angular/core';
import { Route } from '../map/model/route.model';
import { RouteDataService } from '../map/services/route-data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {

  tourName :string;
  userName :string;

  routes : Route[] = [];

  currentRoute : Route;

  constructor(private _rds: RouteDataService) { 

  }

  ngOnInit(): void {
    this._rds.getFutureRoutes$().subscribe((routes: Route[]) => {
      this.routes = routes;
    });
  }

  
  get username() : string {
    return this.userName;
  }
  
  get tourname() : string {
    return this.tourName;
  }

  onClick(route:Route) {
    this.tourName = route.tourName;
    this.currentRoute = route;
    //document.getElementById("aboutTourInfo").innerHTML = "{{\"about_tour_info\" | translate}}";
  }



}
