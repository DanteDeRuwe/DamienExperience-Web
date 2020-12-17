import { NgModule } from '@angular/core';
import { Routes, RouterModule, } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ChatComponent } from './chat/chat.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageroutesComponent } from './admin/manageroutes/manageroutes.component';
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
import { AddRouteComponent } from './admin/add-route/add-route.component';
import { AdminNavComponent } from './admin/admin-nav/admin-nav.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentResolverService } from './services/payment-resolver.service';
import { PaymentResponseComponent } from './payment-response/payment-response.component';
import { RoleGuard } from './user/role.guard';
import { EditRouteComponent } from './admin/edit-route/edit-route.component';
import { RouteResolverService } from './services/route-resolver.service';



const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'track', component: TrackingComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'home', component: HomeComponent },
  { path: 'regulations', component: RegulationsComponent },
  { path: 'privacypolicy', component: PrivacyPolicyComponent },
  { path: 'sponsors', component: SponsorsComponent },
  { path: 'cookiepolicy', component: CookiePolicyComponent},

  { path: 'payment', component: PaymentComponent,resolve : {data: PaymentResolverService}},
  { path: 'payment-response', component: PaymentResponseComponent},
  { path: 'admin-nav', component: AdminNavComponent, canActivate: [RoleGuard],children:[
    { path: 'manageroutes', component: ManageroutesComponent, canActivate: [RoleGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard] },
    { path: 'add-route', component: AddRouteComponent, canActivate: [RoleGuard] },
    { path: 'edit-route/:routename', component: EditRouteComponent, canActivate: [RoleGuard] ,resolve: { route: RouteResolverService }},

  ]},


  //temp route
  { path: 'chat', component: ChatComponent },

  //{ path: 'map', component:MapComponent},
  { path: 'register', component: UserpageComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  //
  { path: 'add-route', component: AddRouteComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
