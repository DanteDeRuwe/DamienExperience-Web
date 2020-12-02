import { Component, OnInit } from '@angular/core';
import { Route } from 'src/app/models/route.model';
import { RouteDataService } from 'src/app/services/route-data.service';

@Component({
  selector: 'app-manageroutes',
  templateUrl: './manageroutes.component.html',
  styleUrls: ['./manageroutes.component.css']
})
export class ManageroutesComponent implements OnInit {

  routes : Route[] = [];

  constructor(private _rds: RouteDataService) { }

  ngOnInit(): void {
    this._rds.getFutureRoutes$().subscribe((routes: Route[]) => {
      this.routes = routes;     
    });
  }

}
