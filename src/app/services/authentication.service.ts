import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

function parseJwt(token) {
  if (!token) {
    return null;
  }
  const base64Token = token.split('.')[1];
  const base64 = base64Token.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly _tokenKey = 'currentUser';
  private _user$: BehaviorSubject<string>;
  public redirectUrl: string = null;
  private _checkAdmin$ =  new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    let parsedToken = parseJwt(localStorage.getItem(this._tokenKey));
    if (parsedToken) {
      const expires: boolean = new Date(parseInt(parsedToken.exp, 10) * 1000) < new Date();
      if (expires) {
        localStorage.removeItem(this._tokenKey);
        parsedToken = null;
      }
    }
    this._user$ = new BehaviorSubject<string>(
      parsedToken && parsedToken.unique_name
    );
    
  }

  get user$(): BehaviorSubject<string> {
    return this._user$;
  }

  get token(): string {
    const localToken = localStorage.getItem(this._tokenKey);
    return !!localToken ? localToken : '';
  }

  get checkAdmin$():Observable<boolean>{
    return this._checkAdmin$;
  }

  //insert code for login request 
  login(email: string, password: string, rememberme: boolean): Observable<boolean> {
    return this.http.post(
      `${environment.apiUrl}/login`,
      {
        email,
        password
      },
      // { responseType: 'text' }
    )
      .pipe(
        map((token: any) => {
          if (token) {
            // if (rememberme) {
            //   localStorage.setItem(this._tokenKey, token);
            // }
            // else {
            //   sessionStorage.setItem(this._tokenKey, token);
            // }
            //this.isAdmin()
            localStorage.setItem(this._tokenKey, token);
            this._user$.next(email);
            return true;
          } else {
            return false;
          }
        })
      );
  }

  //register request
  register(firstname: string, lastname: string,
    dateOfBirth: string, phoneNumber : string,
    email: string, password: string, passwordConfirmation: string,
     rememberme: boolean): Observable<boolean> {
       console.log(dateOfBirth)
    return this.http.post(
      `${environment.apiUrl}/register`,
      {
        firstname,
        lastname,
        dateOfBirth,
        phoneNumber,
        email,
        password,
        passwordConfirmation,
      },
      // { responseType: 'text' }
    )
      .pipe(
        map((token: any) => {
          if (token) {
            // if (rememberme) {
            //   localStorage.setItem(this._tokenKey, token);
            // }
            // else {
            //   sessionStorage.setItem(this._tokenKey, token);
            // }
            localStorage.setItem(this._tokenKey, token);
            this._user$.next(email);
            return true;
          } else {
            return false;
          }
        })
      );
  }

  checkUserNameAvailability = (email: string): Observable<boolean> => {
    return this.http.get<boolean>(
      `${environment.apiUrl}/register/checkusername`,
      {
        params: { email },
      }
    );
  }

  logout() {
    if (this.user$.getValue()) {
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      this._checkAdmin$.next(false);
      this._user$.next(null);
    }
  }

  isAdmin(){
    var ls = localStorage.getItem('currentUser');
    var ss =sessionStorage.getItem('currentUser');
    if(ls || ss){
      this.http.get<boolean>(
         `${environment.apiUrl}/profile/isadmin`
        ).pipe(
          catchError(this.handleError)
        ).subscribe((v: boolean)=>{
          this._checkAdmin$.next(v)
        });
    }else{
      //indien niet ingelogd nooit true zetten
      this._checkAdmin$.next(false)
    }
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
