import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ChatComponent } from './chat/chat.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegulationsComponent } from './regulations/regulations.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { TrackingComponent } from './tracking/tracking.component';
import { AuthGuard } from './user/auth.guard';
import { ProfileComponent } from './user/profile/profile.component';
import { RegisterComponent } from './user/register/register.component';
import { UserpageComponent } from './user/userpage/userpage.component';


const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'track', component: TrackingComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'home', component: HomeComponent },
  { path: 'regulations', component: RegulationsComponent },
  { path: 'privacypolicy', component: PrivacyPolicyComponent},
  { path: 'sponsors', component: SponsorsComponent },
  { path: 'cookiepolicy', component: CookiePolicyComponent},

  //temp route
  { path: 'chat', component: ChatComponent },

  //{ path: 'map', component:MapComponent},
  { path: 'register', component: UserpageComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},

  
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
