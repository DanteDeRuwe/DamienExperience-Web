import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../user/authentication.service';

@Component({

  selector: 'main-nav',

  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent {
  public loggedInUser$ = this._authenticationService.user$;

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router,
    public translate: TranslateService) {
      var langs = ['nl', 'fr']

      

      translate.addLangs(langs);
      var browserLang = navigator.language.substring(0,2)

      console.log(browserLang)


      if(langs.includes(browserLang)){
        translate.setDefaultLang(browserLang);
      }else{
        translate.setDefaultLang('nl');
      }
     }

  register() {
    this._router.navigate(['register']);
  }

  logout() {
    this._authenticationService.logout();
  }

  schrijfIn() {
    if (!this.loggedInUser$.value)
      this._router.navigate(['register']);
    else{
      console.log(this.loggedInUser$.value);
      
      this._router.navigate(['registration']);
    }
  }

  changeLang(lang : string): void{
    this.translate.use(lang);
  }

}
