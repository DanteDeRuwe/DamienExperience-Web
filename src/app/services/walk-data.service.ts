import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Walk } from '../models/walk.model';

@Injectable({
  providedIn: 'root'
})
export class WalkDataService {

  constructor(private http: HttpClient) { }

  getWalk$(email: string): Observable<Walk>{
    return this.http.get(`${environment.apiUrl}/walk/${email}`).pipe(
      catchError(this.handleError),
      map(Walk.fromJson)
    )
  }

  handleError(err: any): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else if (err instanceof HttpErrorResponse) {
      errorMessage = `'${err.status} ${err.statusText}' when accessing '${err.url}'`;
    } else {
      errorMessage = err;
    }
    return throwError(errorMessage);
  }
}
