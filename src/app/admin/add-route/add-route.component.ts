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
  //get acces to child component
  @ViewChild(AddMapComponent)
  private addMapComponent: AddMapComponent;

  hasStartedRecording : boolean
  route : Route
  path : [number[]]
  tourName: string
  date: Date
  distanceInMeters: number
  
  public routeForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    //mabye add color too
    this.routeForm = this.fb.group({
      tourName: ['', [Validators.required,Validators.minLength(4)]],
      date : ['',Validators.required],
      info_nl : ['',[Validators.required,Validators.minLength(4)]],
      info_fr : ['',[Validators.required,Validators.minLength(4)]]
    });
    this.distanceInMeters = 0
    this.hasStartedRecording = false
  }
  onSubmit(which : number){
    this.tourName = this.routeForm.value.tourName;
    this.date = this.routeForm.value.date;
    var nl =this.routeForm.value.info_nl;
    var fr =this.routeForm.value.info_fr;
    var info = {nl, fr}
    this.route = new Route("testid",
      this.tourName,
      this.date,
      69,
      this.path,
      info,
      [])

    if(which==0){
      console.log('Back to dashboard')
    }else{
      console.log('Go to waypoints')
    }
    //see comment ngOnInit()
    
    console.log(this.route)
  }
  //adds ("+") or removes ("-")
  calcDistance(operation : String){
    var last = this.path.length
    var tempDist =  this.distanceInMeters
    var from = turf.point(this.path[last-2]);
    var to = turf.point(this.path[last-1]);
    var distance = turf.distance(from, to, {units: 'kilometers'});
    if(operation=="+"){
      tempDist =tempDist+ distance;
    }else{
      tempDist=tempDist- distance;
    }
    tempDist = tempDist * 100
    tempDist = Math.round(tempDist)
    tempDist = tempDist / 100
    this.distanceInMeters = tempDist
  }
  

  addCoordinates(coords: any) {
    if(this.path==null){
      this.path = [coords]
    }else{
      this.path.push(coords)
      this.calcDistance("+")
    }
    this.addMapComponent.updatePath(this.path)
    this.addMapComponent.drawPath()
    console.log(this.path)
  }

  undo(){
    if(this.path!=null){
      this.calcDistance("-")
      this.path.pop()
      this.addMapComponent.updatePath(this.path)
      this.addMapComponent.drawPath()
    }
  }
  start(){
    this.addMapComponent.startSelecting()
    this.hasStartedRecording = true
  }
  stop(){
    this.addMapComponent.stopSelecting()
    this.hasStartedRecording = false
  }
  getErrorMessage(errors: any): string {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      return 'Dit is verplicht';
    } else if (errors.minlength) {
      return `Heeft op zijn minst ${errors.minlength.requiredLength} karakters nodig (heeft ${errors.minlength.actualLength})`;
    } 
  }
}
