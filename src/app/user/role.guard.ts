import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  ret: boolean;
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log("IS ADMIN: " + this.authService.checkAdmin)
    if (this.authService.checkAdmin) {
      return true;
    } else {
      this.authService.redirectUrl = state.url;
      this.router.navigate(['/home']);
      return false;
    }
  }
}
