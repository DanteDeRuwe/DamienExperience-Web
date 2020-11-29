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

  addWaypoints$(routeId: string, waypoints : Waypoint[]) : Observable<Waypoint[]> {
    return this.http.post(`${environment.apiUrl}/waypoint/addWaypoints`,
      {
        routeId,
        waypoints
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
      console.log(err);
      errorMessage = `'${err.status} ${err.statusText}' when accessing '${err.url}'`;
    } else {
      errorMessage = err;
    }
    return throwError(errorMessage);
  }
  
}
