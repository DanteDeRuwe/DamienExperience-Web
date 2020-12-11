import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Route } from '../models/route.model';
import { Waypoint } from '../models/waypoint.model';
import { Payment } from '../models/payment.model';

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
  //https://localhost:5001/api/routeregistration/
  generatePaymentData(language:string,url:string) {
    
    return this.http.get(`${environment.apiUrl}/routeregistration/generatepaymentdata/${language}`,
      {
        
      }).pipe(
        tap(),
        catchError(this.handleError),
        map(Payment.fromJson)
      )
  }
  paymentResponse(params : any) {
    return this.http.post(`${environment.apiUrl}/routeregistration/ControlPaymentResponse/`,
      {
        Aavaddress :params.AAVADDRESS,
        Acceptance :params.ACCEPTANCE,
        Amount :params.amount,
        Brand :params.BRAND,
        CardNo : params.CARDNO,
        CN : params.CN,
        Currency : params.currency,
        ED : params.ED,
        IP : params.IP,
        NCError : params.NCERROR,
        OrderID : params.orderID,
        PayId : params.PAYID,
        PM:params.PM ,
        ShaSign: params.SHASIGN,
        Status : params.STATUS,
        TRXDate : params.TRXDATE
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
