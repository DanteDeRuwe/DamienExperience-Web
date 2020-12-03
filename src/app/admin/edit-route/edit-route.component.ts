import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Route } from 'src/app/models/route.model';
import { AddMapComponent } from '../add-map/add-map.component';
import { AddRouteFormComponent } from '../add-route-form/add-route-form.component';
import { AddWaypointsFormComponent } from '../add-waypoints-form/add-waypoints-form.component';

@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.scss']
})
export class EditRouteComponent implements OnInit {
  toEditRoute : Route
  routeFormShowing:boolean
  coordinates : [number[]]

  @ViewChild(AddMapComponent)
  private addMapComponent: AddMapComponent
  @ViewChild(AddRouteFormComponent )
  private addRouteFormComponent: AddRouteFormComponent
  @ViewChild(AddWaypointsFormComponent)
  private addWaypointsFormComponent: AddWaypointsFormComponent

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeFormShowing=true
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.route.data.subscribe(item => {
        this.toEditRoute = item['route']
        console.log(this.toEditRoute)
        this.coordinates= this.toEditRoute.path.coordinates
        this.addRouteFormComponent.setRouteFields(this.toEditRoute)
      })
  });
}


}
