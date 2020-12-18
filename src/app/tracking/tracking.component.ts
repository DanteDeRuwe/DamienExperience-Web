import { HttpErrorResponse } from '@angular/common/http';
import { Component,  OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {  Router } from '@angular/router';
import { Route } from '../models/route.model';
import { Walk } from '../models/walk.model';
import { RouteDataService } from '../services/route-data.service';
import { WalkDataService } from '../services/walk-data.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
  roomname: string;

  tourName: string;
  userName: string;
  visible = true;
  
  errorMessage = '';
  chatVisible = false;
  validWalk = false;

  searchForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private _rds: RouteDataService,
    private _wds: WalkDataService) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  onSubmitSearch(){
    const searchresult = this.searchForm.value.username;
    this.roomname = searchresult;
    if(searchresult){
      this._wds.getWalk$(searchresult).subscribe((walk: Walk) =>{
        
        if(walk){
          this._rds.getRouteById$(walk.routeID).subscribe((route: Route) => {
            this.userName = searchresult;
            this.tourName = route.tourName;
            this.validWalk = true;
            this.visible = false
          });
        }else{
          console.log('nowalk')
        }
      },
      (err: HttpErrorResponse) => {
        
        if (err.error instanceof Error) {
          this.translate.get('tracking_error').subscribe( val => {this.errorMessage  = val})
          
          alert(this.errorMessage)
        } else {
          this.errorMessage = `Error ${err.status}`;
          
          this.translate.get('tracking_error').subscribe( val => {this.errorMessage  = val})
          alert(this.errorMessage)
        }
      })
    }else{
      
    }
  }

  onToggleChat(){
    this.chatVisible = !this.chatVisible;
  }

  get tourname(){
    return this.tourName;
  }

  get username(){
    return this.userName
  }
}