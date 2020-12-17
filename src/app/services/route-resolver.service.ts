import { Injectable } from '@angular/core';
import { RouteDataService } from './route-data.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Route } from '../models/route.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteResolverService  implements Resolve<Route>{

  constructor(private routeService: RouteDataService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Route> {
    return this.routeService.getRoute$(route.params['routename']);
  }
}
