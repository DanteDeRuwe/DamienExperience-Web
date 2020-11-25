import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Route } from '../models/route.model';
import { DatainjectionService } from '../services/datainjection.service';
import { RouteDataService } from '../services/route-data.service';

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

  data: Array<any>;
  
  constructor(private _rds: RouteDataService,
    private _dis: DatainjectionService,
    public translate: TranslateService) { }

  ngOnInit(): void {
    this._rds.getFutureRoutes$().subscribe((routes: Route[]) => {
      this.routes = routes;
      this.currentRoute = routes[0];
      this.data = [routes[0].tourName]
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

  onClick(route: Route) {
    this.tourName = route.tourName;
    this.currentRoute = route;
    this.localLang = localStorage.getItem("lang");
    this.routeInfo = route.info[this.localLang];
    this.notifySubject(route);
  }

  notifySubject(route: Route){
    this.data = [route.tourName];
    this._dis.observableMapData(this.data);
  }
}
