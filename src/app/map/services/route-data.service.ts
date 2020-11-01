import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Walk } from '../model/walk.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Route } from '../model/route.model';

@Injectable({
  providedIn: 'root'
})
export class RouteDataService {

  constructor(private http: HttpClient) { }

  getRoute$(name: string): Observable<Route>{
    return this.http.get(`${environment.apiUrl}/route/${name}`).pipe(
      catchError(this.handleError),
      map(Route.fromJson)
    );
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
