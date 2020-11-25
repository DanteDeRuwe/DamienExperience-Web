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
  lineDrawn = false;

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
      var cursor = this.map.getCanvas().style.cursor
      if(cursor == 'pointer'){
        var lngLat = e.lngLat
        this.addCoordinates(lngLat.lng,lngLat.lat)
      }
    })
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

  updatePath(newPath : [number[]]){
    this.path = newPath
  }

  drawPath(){
    var color = "#FE0040"
    if(this.lineDrawn){
      this.map.removeLayer("pathlayer")
      this.map.removeSource("pathsource")
    }
    
    this.map.addSource(`pathsource`, {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': this.path
        }
      }
    });

    this.map.addLayer({
      'id': `pathlayer`,
      'type': 'line',
      'source': `pathsource`,
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
      },
      'paint': {
        'line-color': color,
        'line-width': 4
      }
    });
    
    this.lineDrawn=true
  }
  

}
