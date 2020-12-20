import { Component, OnInit, ViewChild } from '@angular/core';
import { Route } from 'src/app/models/route.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddMapComponent } from '../add-map/add-map.component';
import * as turf from '@turf/turf'
import { AddWaypointsFormComponent } from '../add-waypoints-form/add-waypoints-form.component';
import { Waypoint } from 'src/app/models/waypoint.model';
import { WaypointService } from 'src/app/services/waypoint.service';
import { RouteDataService } from 'src/app/services/route-data.service';
import { Router } from '@angular/router';
import { ErrorDialogComponent } from 'src/app/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss']
})
export class AddRouteComponent implements OnInit {

  distanceInMeters: number = 0
  coordinates : [number[]]
  waypointAdding : number[]
  lineColor : string = "#3bb7a9";

  // change back don't forget 
  //TODO 
   routeFormShowing : boolean = true;
  //routeFormShowing : boolean = false;
  
  route: Route 
   = new Route("","", new Date(),0,{
    lineColor : this.lineColor,
    coordinates: [[]]
},0,[]);
  //get acces to child component
  @ViewChild(AddMapComponent)
  private addMapComponent: AddMapComponent;

  @ViewChild(AddWaypointsFormComponent)
  private addWaypointsFormComponent: AddWaypointsFormComponent;
  dialogRef: any;

  constructor(private _routeService : RouteDataService, 
    private _waypointService : WaypointService, 
    private _router: Router,
    private _dialog: MatDialog) { }

  ngOnInit(): void {  
  }

  //routes
  
  startstopPath(start: boolean){
    if(start) this.addMapComponent.startSelecting()
    else this.addMapComponent.stopSelecting()
  }
  
  updatePath(path: [number[]]){
    this.addMapComponent.updatePath(path)
    this.addMapComponent.drawPath()
  }

  finishRoute(value: any){
    let nl = value.info_nl;
    let fr = value.info_fr;
    let info = {nl, fr}
    let distance = this.distanceInMeters*1000
    this._routeService.addRoute$(value.tourName,
      value.date,
      distance,
      this.lineColor,
      this.coordinates,
      info,
      [])
      .subscribe(temp => 
        {
          this.route = temp;
          this.addMapComponent.showWaypoints(this.route.waypoints);
        },(err) => {
          //console.error(err);
          var errorMessage
          if (err.error instanceof Error) {
            errorMessage = `Error while trying to get the walk user`
            //console.error(this.errorMessage)
          } else {
            errorMessage = `Error ${err}`;
          }
          this.dialogRef = this._dialog.open(ErrorDialogComponent, {
            height: '400px',
            width: '600px',
            data: {
              errorMessage: errorMessage
            }
          });
          this.dialogRef.afterClosed().subscribe(result => {
            this._router.navigate(["admin-nav"])
          });
        });
    this.routeFormShowing=false;
  }

  addCoordinates(coords: any) {
    if(this.coordinates == null){
      this.coordinates = [coords]
      return
    }

    this.coordinates.push(coords)
    this.calcDistance("+")    
    this.addMapComponent.drawPath()
  }

  calcDistance(operation : String){
    if(this.coordinates.length < 2){
      this.distanceInMeters = 0;
      return;
    } 
    var last = this.coordinates.length
    var tempDist =  this.distanceInMeters
    var from = turf.point(this.coordinates[last-2]);
    var to = turf.point(this.coordinates[last-1]);
    var distance = turf.distance(from, to, {units: 'kilometers'});
    if(operation=="+"){
      tempDist =tempDist+ distance;
    }else{
      tempDist=tempDist- distance;
    }
    tempDist = tempDist * 1000
    tempDist = Math.round(tempDist)
    tempDist = tempDist / 1000
    this.distanceInMeters = tempDist
  }

  undoLastPath(){
    if(this.coordinates.length > 0){
      this.calcDistance("-")
      this.coordinates.pop()
      this.addMapComponent.updatePath(this.coordinates)
      this.addMapComponent.drawPath()
    }
  }

  //waypoints
  addWaypointToMap(){
    this.addMapComponent.addWaypoint();
  }

  addCoordinatesWaypoint(coords : number[]){
    this.waypointAdding = coords
    this.addMapComponent.updateWaypoint(this.waypointAdding)
    this.addMapComponent.drawWaypoint()
    this.addWaypointsFormComponent.chosePoint()
  }

  saveAddedWaypoint(value: any){
    this.addMapComponent.stopSelectingWaypoint()

    const titleNl = value.titleGroup.titleDutch;
    const titleFr = value.titleGroup.titleFrench;
    const descriptionNl = value.descriptionGroup.descriptionDutch;
    const descriptionFr = value.descriptionGroup.descriptionFrench;

    var languagesText = {
      title: {
          nl : titleNl,
          fr : titleFr
      },
      description: {
          nl : descriptionNl,
          fr : descriptionFr
      }
    }
    
    var waypoints = this.route.waypoints;
    waypoints.push(new Waypoint("", this.waypointAdding[0], this.waypointAdding[1], languagesText))
    this.route.waypoints = waypoints;
    this.addMapComponent.aferAddWaypoint();
    this.addMapComponent.showWaypoints();
  }

  deleteWaypoint(waypoint : Waypoint){
    var waypoints = this.route.waypoints;
    const index: number = waypoints.indexOf(waypoint);
    if (index !== -1) {
      waypoints.splice(index, 1);
    }  
    this.route.waypoints = waypoints;
    this.addMapComponent.showWaypoints();
  }

  saveWaypoints(){
    this._waypointService.addWaypoints$(this.route.tourName, this.route.waypoints)
    .subscribe(temp =>{ this.route.waypoints = temp}
      ,(err) => {
        //console.error(err);
        var errorMessage
        if (err.error instanceof Error) {
          errorMessage = `Error while trying to get the walk user`
          //console.error(this.errorMessage)
        } else {
          errorMessage = `Error ${err}`;
        }
        this.dialogRef = this._dialog.open(ErrorDialogComponent, {
          height: '400px',
          width: '600px',
          data: {
            errorMessage: errorMessage
          }
        });
        this.dialogRef.afterClosed().subscribe(result => {
          this._router.navigate(["admin-nav"])
        });
      });
    this._router.navigate(['admin-nav/manageroutes']);
  }
}
