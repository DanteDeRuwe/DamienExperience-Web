import { Component, OnInit } from '@angular/core';
import { AdminNavList } from 'src/app/enums.model';
import { Route } from 'src/app/models/route.model';
import { RouteDataService } from 'src/app/services/route-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  routes : Route[] = [];
  navItems = Object.values(AdminNavList);
  lastNavigated = AdminNavList.ManageRoutes

  constructor(private _rds: RouteDataService) { }

  ngOnInit(): void {
    this._rds.getFutureRoutes$().subscribe((routes: Route[]) => {
      this.routes = routes;     
    });
  }

}
