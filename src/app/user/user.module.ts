import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from '../material/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class UserModule { }
