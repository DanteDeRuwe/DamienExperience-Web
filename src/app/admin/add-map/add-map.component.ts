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
  @Input() waypoints: [number[]]
  @Input() waypointAdding: number[]
  @Output() newCoordinates = new EventEmitter<any>();
  @Output() newCoordinatesWaypoint = new EventEmitter<any>();

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  //temp hardcoded startingpoint
  lat = 50.8465573;
  lng = 4.351697;
  lineDrawn = false;
  waypointDrawn = false;
  marker;

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
      if (cursor == 'pointer') {
        var lngLat = e.lngLat
        this.addCoordinates(lngLat.lng, lngLat.lat)
      }
      if (cursor == 'crosshair') {
        var lngLat = e.lngLat
        var coords = [lngLat.lng, lngLat.lat]
        this.newCoordinatesWaypoint.emit(coords)
      }
    })
  }

  addCoordinates(lng: number, lat: number) {
    var coords = [lng, lat]
    this.newCoordinates.emit(coords)
  }

  startSelecting() {
    // Change the cursor to a pointer when the mouse is over the places layer.
    this.map.on('mousemove', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }
  stopSelecting() {
    // Change the cursor to a nothing when the mouse is over the places layer.
    this.map.on('mousemove', () => {
      this.map.getCanvas().style.cursor = '';
    });
    // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  updatePath(newPath: [number[]]) {
    this.path = newPath
  }

  drawPath() {
    var color = "#FE0040"
    if (this.lineDrawn) {
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

    this.lineDrawn = true
  }

  addWaypoint() {
    this.startSelectingWaypoint();
    console.log("trololo");
  }

  startSelectingWaypoint() {
    // Change the cursor to a pointer when the mouse is over the places layer.
    this.map.on('mousemove', () => {
      this.map.getCanvas().style.cursor = 'crosshair';
    });
    // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  stopSelectingWaypoint() {
    // Change the cursor to a nothing when the mouse is over the places layer.
    this.map.on('mousemove', () => {
      this.map.getCanvas().style.cursor = '';
    });
    // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  drawWaypoint() {

    if (this.waypointDrawn) {
      this.map.removeSource("waypointsource")
      this.marker.remove()

    }

    this.map.addSource(`waypointsource`, {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Point',
          'coordinates': this.waypointAdding
        }
      }
    });

    this.marker = new mapboxgl.Marker()
      .setLngLat([this.waypointAdding[0], this.waypointAdding[1]])
      .addTo(this.map);

    this.waypointDrawn = true
  }

  updateWaypoint(waypointAdding: number[]) {
    this.waypointAdding = waypointAdding
  }

  saveMarker(title: string, description: string){
    this.marker.remove()
    this.waypointDrawn=false
    let marker = new mapboxgl.Marker()
    .setLngLat([this.waypointAdding[0], this.waypointAdding[1]])
    .setPopup( new mapboxgl.Popup({ offset: 25 })
    .setHTML('<h3>' + title + '</h3><p>' + description + '</p>'))
    .addTo(this.map);
  }
}
