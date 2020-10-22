import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { MapComponent } from './map/map.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './user/auth.guard';
import { ProfileComponent } from './user/profile/profile.component';
import { RegisterComponent } from './user/register/register.component';
import { UserpageComponent } from './user/userpage/userpage.component';


const routes: Routes = [
  { path: 'about', component: AboutComponent},

  //temp map
  { path: 'map', component:MapComponent},

  { path: 'register', component: UserpageComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},

  
  { path: '', redirectTo: 'about', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
