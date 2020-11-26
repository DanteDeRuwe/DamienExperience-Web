import { Component, OnInit, ViewChild } from '@angular/core';
import { Route } from 'src/app/models/route.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddMapComponent } from '../add-map/add-map.component';
import * as turf from '@turf/turf'

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss']
})
export class AddRouteComponent implements OnInit {

  distance: number = 0
  path : [number[]]
  routeFormShowing : boolean = false

  //get acces to child component
  @ViewChild(AddMapComponent)
  private addMapComponent: AddMapComponent;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {  }

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
    let route = new Route("testid",
      value.tourName,
      value.date,
      this.distance,
      this.path,
      info,
      []) //TODO waypoints
    console.log(route)
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
}
