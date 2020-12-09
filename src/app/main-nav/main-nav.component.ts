import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({

  selector: 'main-nav',

  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent {
  public loggedInUser$ = this._authenticationService.user$;
  current = ""
  isCheckAdmin :boolean;
  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router,
    public translate: TranslateService) {
      _router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          _authenticationService.isAdmin()
        }
      });
    }

  ngOnInit(){

    //adds dutch and french as supported languages
    const langs = ['nl', 'fr']
    this.translate.addLangs(langs);

    //checks if language is saved in localstorage
    //else checks if user's browser's language is supported
    //default dutch
    const localLang: string = localStorage.getItem("lang");
    if (localLang) {
      this.translate.setDefaultLang(localLang)
      this.current = localLang
    } else {
      const browserLang = navigator.language.substring(0, 2)
      if (langs.includes(browserLang)) {
        this.translate.setDefaultLang(browserLang);
        this.current = browserLang
      } else {
        this.translate.setDefaultLang('nl');
      }
      localStorage.setItem("lang", this.translate.getDefaultLang())
    }
    this._authenticationService.checkAdmin$.subscribe(
      (v:boolean)=>
      {
        console.log(v)
        this.isCheckAdmin=v;
      }
    )
  }

  register() {
    this._router.navigate(['register']);
  }

  logout() {
    this._authenticationService.logout();
    this._router.navigate(['home']);
  }

  schrijfIn() {
    if (!this.loggedInUser$.value)
      this._router.navigate(['register']);
    else {
      //DELETE console.log(this.loggedInUser$.value);

      this._router.navigate(['registration']);
    }
  }
  checkLang(lang:String):boolean{
    return lang === this.current
  }


  //changes current language + saves in localstorage
  changeLang(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem("lang", lang)
  }
}
