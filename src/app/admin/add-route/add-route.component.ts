import { Component, OnInit, ViewChild } from '@angular/core';
import { Route } from 'src/app/models/route.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddMapComponent } from '../add-map/add-map.component';

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss']
})
export class AddRouteComponent implements OnInit {
  //get acces to child component
  @ViewChild(AddMapComponent)
  private addMapComponent: AddMapComponent;

  route : Route
  path : [number[]]
  tourName: string
  date: Date
  distanceInMeters: number
  public searchForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    //mabye add color too
    this.searchForm = this.fb.group({
      tourName: ['', Validators.required],
      date : ['',Validators.required],
      info_nl : ['',Validators.required],
      info_fr : ['',Validators.required]
    });
  }
  onSubmitSearch(){
    //see comment ngOnInit()
    this.tourName = this.searchForm.value.tourName;
    this.date = this.searchForm.value.date;
    var nl =this.searchForm.value.info_nl;
    var fr =this.searchForm.value.info_fr;
    var info = {nl, fr}
    this.route = new Route("testid",
      this.tourName,
      this.date,
      69,
      this.path,
      info,
      [])
    console.log(this.route)
  }

  addCoordinates(coords: number[]) {
    if(this.path==null){
      this.path = [coords]
    }else{
      this.path.push(coords)
    }
    this.addMapComponent.updatePath(this.path)
    this.addMapComponent.drawPath()
    console.log(this.path)
  }

  undo(){
    if(this.path!=null){
      this.path.pop()
      this.addMapComponent.updatePath(this.path)
      this.addMapComponent.drawPath()
    }
  }
  start(){
    this.addMapComponent.startSelecting()
  }

}
