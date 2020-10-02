import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

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

  constructor(private http: HttpClient) {
    let parsedToken = parseJwt(localStorage.getItem(this._tokenKey));
    if(parsedToken){
      const expires = new Date(parseInt(parsedToken.exp, 10) * 1000)
      if(expires){
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

   //insert code for login request 
   //login(){}

   //register request
   register(firstname: string, lastname: string, 
            email: string, password: string): Observable<boolean> {
     return this.http.post(
       `${environment.apiUrl}/Users/register`,
       {
         firstname,
         lastname,
         email,
         password,
         passwordConfirmation: password,
       },
       {responseType: 'text'}
     )
     .pipe(
       map((token: any) => {
         if(token) {
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
      `${environment.apiUrl}/Users/checkusername`,
      {
        params: { email },
      }
    );
  };
}
