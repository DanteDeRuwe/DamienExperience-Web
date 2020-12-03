import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Route } from 'src/app/models/route.model';
import { AddMapComponent } from '../add-map/add-map.component';
import { AddRouteFormComponent } from '../add-route-form/add-route-form.component';
import { AddWaypointsFormComponent } from '../add-waypoints-form/add-waypoints-form.component';
import * as turf from '@turf/turf'
import { RouteDataService } from 'src/app/services/route-data.service';
import { WaypointService } from 'src/app/services/waypoint.service';
import { DatePipe } from '@angular/common';
import { Waypoint } from 'src/app/models/waypoint.model';

@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.scss']
})
export class EditRouteComponent implements OnInit {
  toEditRoute : Route
  lineColor : string = "#3bb7a9";
  routeFormShowing:boolean
  distanceInMeters: number
  coordinates : [number[]]
  waypointAdding : number[]
  waypoints : Waypoint[] = []

  @ViewChild(AddMapComponent)
  private addMapComponent: AddMapComponent
  @ViewChild(AddRouteFormComponent )
  private addRouteFormComponent: AddRouteFormComponent
  @ViewChild(AddWaypointsFormComponent)
  private addWaypointsFormComponent: AddWaypointsFormComponent

  constructor(private route: ActivatedRoute,private _routeService : RouteDataService, 
    private _waypointService : WaypointService) { }

  ngOnInit(): void {
    this.routeFormShowing=true
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.route.data.subscribe(item => {
        this.toEditRoute = item['route']
        console.log(this.toEditRoute)
        this.coordinates= this.toEditRoute.path.coordinates
        this.waypoints = this.toEditRoute.waypoints
        this.distanceInMeters = this.toEditRoute.distanceInMeters/1000
        this.addRouteFormComponent.setRouteFields(this.toEditRoute)
        //this.addMapComponent.drawPath()
      })
  });
}
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
  this._routeService.updateRoute$(value.tourName,
    value.date,
    distance,
    this.lineColor,
    this.coordinates,
    info,
    this.toEditRoute.waypoints)
      .subscribe(temp =>{
        console.log(temp)
      })
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
  
  var waypoints = this.toEditRoute.waypoints;
  waypoints.push(new Waypoint("", this.waypointAdding[0], this.waypointAdding[1], languagesText))
  this.toEditRoute.waypoints = waypoints;
  this.addMapComponent.aferAddWaypoint();
  this.addMapComponent.showWaypoints();
  console.log(this.route)
}

deleteWaypoint(waypoint : Waypoint){
  var waypoints = this.toEditRoute.waypoints;
  const index: number = waypoints.indexOf(waypoint);
  if (index !== -1) {
    waypoints.splice(index, 1);
  }  
  this.toEditRoute.waypoints = waypoints;
  this.addMapComponent.showWaypoints();
}

saveWaypoints(){
  this._waypointService.addWaypoints$(this.toEditRoute.tourName, this.toEditRoute.waypoints).subscribe(temp => this.toEditRoute.waypoints = temp);
}


}
