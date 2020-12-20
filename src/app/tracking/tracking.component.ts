import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Route } from '../models/route.model';
import { Walk } from '../models/walk.model';
import { RouteDataService } from '../services/route-data.service';
import { WalkDataService } from '../services/walk-data.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
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
  dialogRef;
  searchForm: FormGroup;

  walk: Walk;
  route: Route;

  constructor(private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private _rds: RouteDataService,
    private _wds: WalkDataService,
    private activatedRoute: ActivatedRoute,
    private _dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let email = params['email'];
      if (!!email) {
        this.visible = false;
        this.initWalk(email)
      }
    });

    this.searchForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  onSubmitSearch() {
    const searchresult = this.searchForm.value.username;
    this.roomname = searchresult;
    if (searchresult) {
      this.router.navigate(["/track"], { queryParams: { email: searchresult } })
    }
  }

  private initWalk(email: string) {
    this._wds.getWalk$(email)
      .pipe(take(1)) //only get initial walk
      .subscribe((walk: Walk) => {
        if (walk) {
          this.setupWalk(walk)
          this.setWalkToLiveWalk(email) //after initializing, use the live walk
          this.visible = false;
        }
      },
        (err) => {
          //console.error(err);
          if (err.error instanceof Error) {
            this.errorMessage = `Error while trying to get the walk user`
          } else {
            this.errorMessage = `Error ${err}`;
          }
          this.dialogRef = this._dialog.open(ErrorDialogComponent, {
            height: '400px',
            width: '600px',
            data: {
              errorMessage: this.errorMessage
            }
          });
          this.dialogRef.afterClosed().subscribe(result => {
            this.visible=true
            this.searchForm.controls['username'].setValue("");
            this.router.navigate([], {
              queryParams: {
                email: null
              },
              queryParamsHandling: 'merge'
            })
          });
          
        });
  }

  onToggleChat() {
    this.chatVisible = !this.chatVisible;
  }

  private setupWalk(walk: Walk) {
    this.walk = walk;
    this._rds.getRouteById$(walk.routeID).subscribe((route: Route) => {
      this.route = route;
      this.visible = false
    });
  }

  private setWalkToLiveWalk(userToTrack: string) {
    this._wds.connectToTrackingHub(userToTrack); //connects to the real-time service
    this._wds.liveWalk.subscribe(x => this.walk = x);
  }
}
