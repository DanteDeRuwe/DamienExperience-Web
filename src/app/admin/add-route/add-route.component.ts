import { Component, OnInit, ViewChild } from '@angular/core';
import { Route } from 'src/app/models/route.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddMapComponent } from '../add-map/add-map.component';
import * as turf from '@turf/turf'
import { AddWaypointsFormComponent } from '../add-waypoints-form/add-waypoints-form.component';
import { Waypoint } from 'src/app/models/waypoint.model';
import { WaypointService } from 'src/app/services/waypoint.service';
import { RouteDataService } from 'src/app/services/route-data.service';

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
  waypointsDUMMY : Waypoint[] //TODO DELETE DUMMYDATA
  = [
    Waypoint.fromJson({
      id: "2b6c07f0-4464-41c1-a837-eab958a0d0e2",
      longitude: 4.705204,
      latitude: 50.99041,
      languagesText: {
        title: {
          nl: "Delhaize Tremelo",
          fr: "Delhaize Tremelo"
        },
        description: {
          nl: "Gratis blikje frisdrank en snoepreep bij vertoon van een geldige coupon.",
          fr: "Canette de soda et bonbon gratuit"
        }
      }
    }), Waypoint.fromJson(
    {
      id: "0570fdbb-28e5-4cb8-a41f-defcbc3aeba9",
      longitude: 4.708955,
      latitude: 50.994423,
      languagesText: {
        title: {
          nl: "Bevoorrading 1",
          fr: "Rations 1"
        },
        description: {
          nl: "Hier krijg je een appeltje voor de dorst!",
          fr: "une pomme ou deux"
        }
      }
    })
  ];
  routeFormShowing : boolean = true;
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

  constructor(private _routeService : RouteDataService, private _waypointService : WaypointService, private fb: FormBuilder) { }

  ngOnInit(): void {  
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
      this._routeService.addRoute$(value.tourName,
        value.date,
        distance,
        this.lineColor,
        this.coordinates,
        info,
        this.waypointsDUMMY).subscribe(temp => {this.route = temp; console.log(this.route); //TODO DELETE DUMMYDATA
          this.addMapComponent.showWaypoints(this.route.waypoints);});
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
    console.log(this.route)
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
    this._waypointService.addWaypoints$(this.route.tourName, this.route.waypoints).subscribe(temp => this.route.waypoints = temp);
  }
}
