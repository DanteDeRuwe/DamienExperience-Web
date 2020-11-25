import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../services/authentication.service';

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

    //adds dutch and french as supported languages
    const langs = ['nl', 'fr']
    translate.addLangs(langs);


    //checks if language is saved in localstorage
    //else checks if user's browser's language is supported
    //default dutch
    const localLang: string = localStorage.getItem("lang");

    if (localLang) {
      translate.setDefaultLang(localLang)
    } else {
      const browserLang = navigator.language.substring(0, 2)

      if (langs.includes(browserLang)) {
        translate.setDefaultLang(browserLang);
      } else {
        translate.setDefaultLang('nl');
      }

      localStorage.setItem("lang", translate.getDefaultLang())
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
    else {
      console.log(this.loggedInUser$.value);

      this._router.navigate(['registration']);
    }
  }


  //changes current language + saves in localstorage
  changeLang(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem("lang", lang)
  }

}
