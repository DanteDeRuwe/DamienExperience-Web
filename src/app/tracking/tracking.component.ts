import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
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
  visible = true;
  errorMessage = '';
  chatVisible = false;

  searchForm: FormGroup;

  walk: Walk;
  route: Route;

  constructor(private fb: FormBuilder,
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
    if (searchresult) {
      this._wds.getWalk$(searchresult)
        .pipe(take(1)) //only get initial walk
        .subscribe((walk: Walk) => {
          if (walk) {
            this.setupWalk(walk)
            this.setWalkToLiveWalk() //after initializing, use the live walk
          } else {
            console.log('nowalk')
          }
        },
          (err: HttpErrorResponse) => {
            console.error(err);
            if (err.error instanceof Error) {
              this.errorMessage = `Error while trying to get the walk user`
              console.error(this.errorMessage)
            } else {
              this.errorMessage = `Error ${err.status}`;
              console.error(this.errorMessage)
            }
          });

      this._wds.connectToTrackingHub(); //connects to the real-time service
      this.visible = false;

    } else {
      console.log('nouser')
    }
  }

  onToggleChat(){
    this.chatVisible = !this.chatVisible;
  }

  private setupWalk(walk: Walk) {
    this.walk = walk;
    this._rds.getRouteById$(walk.routeID).subscribe((route: Route) => {
      this.route = route;
      this.visible = false
    });
  }

  private setWalkToLiveWalk() {
    this._wds.liveWalk.subscribe(x => this.walk = x);
  }
}