import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
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
  routeInfo: string

  currentRoute : Route;
  localLang: string = localStorage.getItem("lang");
  
  constructor(private _rds: RouteDataService,
    public translate: TranslateService) { }

  ngOnInit(): void {
    this._rds.getFutureRoutes$().subscribe((routes: Route[]) => {
      this.routes = routes;
      this.currentRoute = routes[0];
      this.tourName = this.currentRoute.tourName;
      this.routeInfo = this.currentRoute.info[this.localLang]
      this.dataLoaded = true;
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent)=>{
      this.routeInfo = this.currentRoute.info[event.lang]
    })
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
    this.localLang = localStorage.getItem("lang");
    this.routeInfo = route.info[this.localLang]
  }
}
