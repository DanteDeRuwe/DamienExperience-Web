import { Component, OnInit } from '@angular/core';
import { Route } from '../map/model/route.model';
import { RouteDataService } from '../map/services/route-data.service';

@Component({
  selector: 'app-tourselector',
  templateUrl: './tourselector.component.html',
  styleUrls: ['./tourselector.component.css']
})
export class TourselectorComponent implements OnInit {

  tourName :string;
  userName :string;
  dataLoaded: boolean = false;
  routes : Route[] = [];

  currentRoute : Route;
  
  constructor(private _rds: RouteDataService) { }

  ngOnInit(): void {
    this._rds.getFutureRoutes$().subscribe((routes: Route[]) => {
      this.routes = routes;
      this.currentRoute = routes[0];
      this.tourName = this.currentRoute.tourName;
      this.dataLoaded = true;
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
  }

}
