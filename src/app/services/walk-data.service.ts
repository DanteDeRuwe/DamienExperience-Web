import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { Observable, throwError, ReplaySubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Walk } from '../models/walk.model';

@Injectable({
  providedIn: 'root'
})
export class WalkDataService {

  private hubConnection: HubConnection
  public liveWalk: ReplaySubject<Walk> = new ReplaySubject<Walk>(1);

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
      console.log(err);
      errorMessage = `'${err.status} ${err.statusText}' when accessing '${err.url}'`;
    } else {
      errorMessage = err;
    }
    return throwError(errorMessage);
  }


  connectToTrackingHub() {
    this.startHubConnection();
    this.addHubListeners();
  }

  private startHubConnection() {
    this.hubConnection = this.getHubConnection();

    this.hubConnection.start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while establishing signalr connection: ' + err))
  }

  private addHubListeners() {
    this.hubConnection.on("updateWalk", (data: Walk) => {
      this.liveWalk.next(data);
    })
  }

  private getHubConnection(): HubConnection {
    return new HubConnectionBuilder()
      .withUrl(environment.trackingHubUrl)
      //.configureLogging(LogLevel.Trace)
      .build();
  }


}
