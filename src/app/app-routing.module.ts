import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './user/register/register.component';
import { UserpageComponent } from './user/userpage/userpage.component';


const routes: Routes = [
  { path: 'about', component: AboutComponent},
  { path: 'register', component: UserpageComponent },

  { path: '', redirectTo: 'about', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
