import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { MapComponent } from './map/map.component';

import { RegisterComponent } from './user/register/register.component';
import { MaterialModule } from './material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './user/login/login.component';
import { UserpageComponent } from './user/userpage/userpage.component';
import { httpInterceptorProviders } from './interceptors';
import { ProfileComponent } from './user/profile/profile.component';
import { TrackingComponent } from './tracking/tracking.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { RegulationsComponent } from './regulations/regulations.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TourselectorComponent } from './tourselector/tourselector.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';



@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    AboutComponent,
    PageNotFoundComponent,
    MapComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    UserpageComponent,
    TrackingComponent,
    RegistrationComponent,
    HomeComponent,
    RegulationsComponent,
    PrivacyPolicyComponent,
    SponsorsComponent,
    CookiePolicyComponent,
    TourselectorComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http);
}
