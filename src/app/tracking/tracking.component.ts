import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgForm } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Route } from '../models/route.model';
import { Walk } from '../models/walk.model';
import { RouteDataService } from '../services/route-data.service';
import { WalkDataService } from '../services/walk-data.service';
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
  roomname: string;

  tourName: string;
  userName: string;
  visible: boolean = true;
  
  public errorMessage: string = '';
  chatVisible: boolean = false;
  validWalk: boolean = false;

  public searchForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private _rds: RouteDataService,
    private _wds: WalkDataService) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  onSubmitSearch(){
    let searchresult = this.searchForm.value.username;
    this.roomname = searchresult;
    if(searchresult){
      this._wds.getWalk$(searchresult).subscribe((walk: Walk) =>{
        console.log(walk)
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
        console.log(err);
        if (err.error instanceof Error) {
          this.errorMessage = `Error while trying to get the walk user`
          console.log(this.errorMessage)
        } else {
          this.errorMessage = `Error ${err.status}`;
          console.log(this.errorMessage)
        }
      })
    }else{
      console.log('nouser')
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