import { Injectable } from '@angular/core';
import { Payment } from '../models/payment.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouteDataService } from './route-data.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentResolverService implements Resolve<Payment> {
  constructor(private routeService: RouteDataService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Payment> {
    var userLang = navigator.language.replace("-","_");
    var responseURL = environment.url+'/payment-response'
    //http://localhost:4200/payment-response
    return this.routeService.generatePaymentData(userLang,responseURL)
  }
}
