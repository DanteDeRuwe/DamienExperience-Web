import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Route } from '../models/route.model';
import { Waypoint } from '../models/waypoint.model';

@Injectable({
  providedIn: 'root'
})
export class RouteDataService {
  public redirectUrl: string = null;

  constructor(private http: HttpClient) { }

  getRoute$(name: string): Observable<Route> {
    return this.http.get(`${environment.apiUrl}/route/${name}`).pipe(
      catchError(this.handleError),
      map(Route.fromJson)
    );
  }

  getFutureRoutes$(): Observable<Route[]> {
    return this.http.get(`${environment.apiUrl}/route/getfutureroutes`).pipe(
      catchError(this.handleError),
      map((list: any[]): Route[] => list.map(Route.fromJson))
    )
  }

  routeRegistration$(routeId: string, orderedShirt: boolean, shirtSize: string) {
    return this.http.post(`${environment.apiUrl}/routeregistration`,
      {
        routeId,
        orderedShirt,
        shirtSize
      }).pipe(
        tap(),
        catchError(this.handleError)
      )
  }

  addRoute$(
    tourName : string,
    date : Date,
    distanceInMeters : number,
    lineColor : string,
    coordinates : [number[]],
    info : {},
    waypoints : Waypoint[]) {
      var jsonWaypoints = Waypoint.toJsonList(waypoints);
    return this.http.post(`${environment.apiUrl}/route/add`,
      {
        tourName,
        date,
        lineColor,
        distanceInMeters,
        coordinates,
        info,
        waypoints : jsonWaypoints
      }).pipe(
        tap(console.log),
        catchError(this.handleError),
        map(Route.fromJson)
      )
  }


  handleError(err: any): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else if (err instanceof HttpErrorResponse) {
      console.log(err);
      errorMessage = `'${err.status} ${err.statusText}' when accessing '${err.url}'`;
    } else {
      errorMessage = err;
    }
    return throwError(errorMessage);
  }
}
