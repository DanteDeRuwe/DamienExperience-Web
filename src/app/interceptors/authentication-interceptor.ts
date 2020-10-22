import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { AuthenticationService } from '../user/authentication.service';
  import { Observable } from 'rxjs';
import { cpuUsage } from 'process';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.token.length) {
        let token = this.authService.token.replace(/[\"]+/g,'');
        console.log(token)
      const clonedRequest = req.clone({
        headers: req.headers.set(
          'Authorization',
          `Bearer ${token}`
        ),
      });
      console.log(clonedRequest)
      return next.handle(clonedRequest);
    }
    return next.handle(req);
  }
}