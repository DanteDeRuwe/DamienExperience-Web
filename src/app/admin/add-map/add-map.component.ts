import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Route } from 'src/app/models/route.model';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-map',
  templateUrl: './add-map.component.html',
  styleUrls: ['./add-map.component.scss']
})
export class AddMapComponent implements OnInit {
  @Input() path: [number[]];
  @Output() newCoordinates = new EventEmitter<number[]>();

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
    
  //temp hardcoded startingpoint
  lat = 50.8465573;
  lng = 4.351697;
  constructor() { }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 10,
      center: [this.lng, this.lat]
    })

    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('click', (e) => {
      var lngLat = e.lngLat
      this.addCoordinates(lngLat.lng,lngLat.lat)
    })
    this.startSelecting()
  }

  addCoordinates(lng : number, lat : number) {
    var coords = [lng,lat]
    this.newCoordinates.emit(coords)
  }

  startSelecting(){
    // Change the cursor to a pointer when the mouse is over the places layer.
    this.map.on('mousemove', () => {
      this.map.getCanvas().style.cursor = 'pointer';
      });
      // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }
  

}
