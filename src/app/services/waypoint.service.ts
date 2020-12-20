import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Waypoint } from '../models/waypoint.model';

@Injectable({
  providedIn: 'root'
})
export class WaypointService {

  constructor(private http: HttpClient) { }

  addWaypoints$(routeName: string, waypoints : Waypoint[]) : Observable<Waypoint[]> {
    var res = Waypoint.toDTOList(waypoints);
    return this.http.post(`${environment.apiUrl}/waypoint/addwaypoints`,
      {
        tourName : routeName,
        dtos : res
      }).pipe(
        tap(),
        catchError(this.handleError),
        map((list: any[]): Waypoint[] => list.map(Waypoint.fromJson))
      )
  }

  handleError(err: any): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else if (err instanceof HttpErrorResponse) {
      errorMessage = `'${err.status} ${err.statusText}': ${err.error}`;
    } else {
      errorMessage = err;
    } 
    return throwError(errorMessage);
  }
  
}
