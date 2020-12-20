import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material/material.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { httpTranslateLoader } from '../app.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRouteComponent } from './add-route/add-route.component';
import { AddMapComponent } from './add-map/add-map.component';
import { AddRouteFormComponent } from './add-route-form/add-route-form.component';
import { AddWaypointsFormComponent } from './add-waypoints-form/add-waypoints-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageroutesComponent } from './manageroutes/manageroutes.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { DeleteRouteDialogComponent } from './delete-route-dialog/delete-route-dialog.component';
import { EditRouteComponent } from './edit-route/edit-route.component';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../user/role.guard';
import { RouteResolverService } from '../services/route-resolver.service';

const routes : Routes =[
  { path: 'manageroutes', component: ManageroutesComponent, canActivate: [RoleGuard] },
  //has currently no functunality in project
  //{ path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard] },
  { path: 'add-route', component: AddRouteComponent, canActivate: [RoleGuard] },
  { path: 'edit-route/:routename', component: EditRouteComponent, canActivate: [RoleGuard] ,resolve: { route: RouteResolverService }},
]

@NgModule({
  declarations: [
    AddRouteComponent,
    AddMapComponent,
    AddRouteFormComponent,
    AddWaypointsFormComponent,
    DashboardComponent,
    ManageroutesComponent,
    AdminNavComponent,
    DeleteRouteDialogComponent,
    EditRouteComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports : [AdminNavComponent,TranslateModule,],
})
export class AdminModule { }
