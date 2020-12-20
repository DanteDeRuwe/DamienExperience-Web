import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) { 

  }

  changeCredentials(user: any){
    return this.http.put(`${environment.apiUrl}/profile/update`, user).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  get profile$(): Observable<User>{
    return this.http.get(`${environment.apiUrl}/profile`).pipe(
      catchError(this.handleError),
      map(User.fromJson)
    );
  }

  updateFriends(friends : string[]){
    return this.http.put(`${environment.apiUrl}/profile/UpdateFriends`,friends).pipe(
      catchError(this.handleError)
    );
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
