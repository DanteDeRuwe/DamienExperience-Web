import { Injectable } from '@angular/core';
import { Payment } from '../models/payment.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouteDataService } from './route-data.service';
import { Observable } from 'rxjs';

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
    return this.routeService.generatePaymentData(userLang)
  }
}
