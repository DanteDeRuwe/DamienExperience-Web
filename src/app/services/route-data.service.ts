import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Route } from '../models/route.model';
import { Waypoint } from '../models/waypoint.model';
import { Privacy } from '../enums.model';

@Injectable({
  providedIn: 'root'
})
export class RouteDataService {
  public redirectUrl: string = null;

  constructor(private http: HttpClient) { }

  getRoute$(name: string): Observable<Route> {
    return this.http.get(`${environment.apiUrl}/route/getroutebyname/${name}`).pipe(
      catchError(this.handleError),
      map(Route.fromJson)
    );
  }

  getRouteById$(id: string): Observable<Route> {
    return this.http.get(`${environment.apiUrl}/route/getroutebyid/${id}`).pipe(
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

  routeRegistration$(routeId: string, orderedShirt: boolean, shirtSize: string, privacy: Privacy) {
    return this.http.post(`${environment.apiUrl}/routeregistration`,
      {
        routeId,
        orderedShirt,
        shirtSize,
        privacy
      }).pipe(
        tap(),
        catchError(this.handleError)
      )
  }

  deleteRoute(routeName: string) {
    return this.http.delete(`${environment.apiUrl}/route/delete?routeName=${routeName}`
    )
      .pipe(
        tap(),
        catchError(this.handleError)
      ).subscribe()
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
        distanceInMeters,
        lineColor,
        coordinates,
        info,
        waypoints : jsonWaypoints
      }).pipe(
        tap(),
        catchError(this.handleError),
        map(Route.fromJson)
      )
  }

  updateRoute$(
    tourName : string,
    date : Date,
    distanceInMeters : number,
    lineColor : string,
    coordinates : [number[]],
    info : {},
    waypoints : Waypoint[]) {
      var jsonWaypoints = Waypoint.toJsonList(waypoints);
    return this.http.put(`${environment.apiUrl}/route/update`,
      {
        tourName,
        date,
        distanceInMeters,
        lineColor,
        coordinates,
        info,
        waypoints : jsonWaypoints
      }).pipe(
        tap(),
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
