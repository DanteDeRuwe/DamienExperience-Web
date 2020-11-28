import { Component, OnInit, ViewChild } from '@angular/core';
import { Route } from 'src/app/models/route.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddMapComponent } from '../add-map/add-map.component';
import * as turf from '@turf/turf'
import { AddWaypointsFormComponent } from '../add-waypoints-form/add-waypoints-form.component';
import { Waypoint } from 'src/app/models/waypoint.model';

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss']
})
export class AddRouteComponent implements OnInit {

  distance: number = 0
  path : [number[]]
  waypointAdding : number[]
  waypoints : Waypoint[] //= []
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
  routeFormShowing : boolean = true
  route: Route

  //get acces to child component
  @ViewChild(AddMapComponent)
  private addMapComponent: AddMapComponent;

  @ViewChild(AddWaypointsFormComponent)
  private addWaypointsFormComponent: AddWaypointsFormComponent;

  constructor(private fb: FormBuilder) { }

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
    this.route = new Route("testid",
      value.tourName,
      value.date,
      this.distance,
      this.path,
      info,
      []) //TODO waypoints
    console.log(this.route)
    this.routeFormShowing=false;
  }

  addCoordinates(coords: any) {
    if(this.path == null){
      this.path = [coords]
      return
    }

    this.path.push(coords)
    this.calcDistance("+")    
    this.addMapComponent.drawPath()
  }

  calcDistance(operation : String){
    if(this.path.length < 2){
      this.distance = 0;
      return;
    } 
    var last = this.path.length
    var tempDist =  this.distance
    var from = turf.point(this.path[last-2]);
    var to = turf.point(this.path[last-1]);
    var distance = turf.distance(from, to, {units: 'kilometers'});
    if(operation=="+"){
      tempDist =tempDist+ distance;
    }else{
      tempDist=tempDist- distance;
    }
    tempDist = tempDist * 1000
    tempDist = Math.round(tempDist)
    tempDist = tempDist / 1000
    this.distance = tempDist
  }

  undoLastPath(){
    if(this.path.length > 0){
      this.calcDistance("-")
      this.path.pop()
      this.addMapComponent.updatePath(this.path)
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
    const descriptionFr = value.descriptionGroup.descriptionDutch;

    // if(localStorage.getItem('lang')==='nl'){
    //   this.addMapComponent.saveMarker(titleNl, descriptionNl)
    // } else{
    //   this.addMapComponent.saveMarker(titleFr, descriptionFr)
    // }
    

    this.waypoints.push(new Waypoint("", this.waypointAdding[0], this.waypointAdding[1], [[titleNl, titleFr],[descriptionNl, descriptionFr]]))
    
    this.route.waypoints = this.waypoints;
    this.addMapComponent.showWaypoints(this.waypoints);
    console.log(this.route)
  }

  deleteWaypoint(waypoint : Waypoint){
    const index: number = this.route.waypoints.indexOf(waypoint);
    if (index !== -1) {
      this.route.waypoints.splice(index, 1);
    }  
  }
}
