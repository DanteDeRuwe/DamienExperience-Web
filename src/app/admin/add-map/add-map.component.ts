import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Route } from 'src/app/models/route.model';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Waypoint } from 'src/app/models/waypoint.model';

@Component({
  selector: 'app-add-map',
  templateUrl: './add-map.component.html',
  styleUrls: ['./add-map.component.scss']
})
export class AddMapComponent implements OnInit {
  @Input() coordinates: [number[]];
  @Input() waypoints: Waypoint[];
  @Input() waypointAdding: number[];
  @Output() newCoordinates = new EventEmitter<any>();
  @Output() newCoordinatesWaypoint = new EventEmitter<any>();

  waypointMarkers : mapboxgl.Marker[] = [];

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
    this.map.on('load',()=>{
      this.drawPath()
      this.showWaypoints(this.waypoints)
      this.fitToBounds(this.coordinates)

    })
  }
  fitToBounds(coords : any) {
    var bounds = coords.reduce(function (bounds, coord) {
      return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coords[0], coords[0]));
      this.map.fitBounds(bounds, {
      padding: 20
    });
  }
  ngOnDestroy() {
    this.removePath()
    this.removeWaypoints()
  }

  //route
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
    this.coordinates = newPath
  }
  removePath(){
    if (this.lineDrawn) {
      this.map.removeLayer("pathlayer")
      this.map.removeSource("pathsource")
    }
  }
  drawPath() {
    var color = "#FE0040"
    this.removePath()

    this.map.addSource(`pathsource`, {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': this.coordinates
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
  //waypoints
  addWaypoint() {
    this.startSelectingWaypoint();
  }

  aferAddWaypoint() {
    this.stopSelectingWaypoint();
    if (this.waypointDrawn) {
      this.marker.remove()
    }
    this.waypointDrawn = false;
    console.log("Merry Christmas");
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
      this.marker.remove()
    }

    this.marker = new mapboxgl.Marker()
      .setLngLat([this.waypointAdding[0], this.waypointAdding[1]])
      .addTo(this.map);

    this.waypointDrawn = true
  }

  updateWaypoint(waypointAdding: number[]) {
    this.waypointAdding = waypointAdding
  }

  removeWaypoints(){
    if(this.waypointMarkers != null){
      this.waypointMarkers.forEach(marker => {
        marker.remove();
      });
    }
  }
  showWaypoints(waypoints: Waypoint[] = null){
    this.removeWaypoints()

    if(waypoints != null)
      this.waypoints = waypoints;

    let localLang: string = localStorage.getItem("lang");
    this.waypoints.forEach(waypoint => {

      var marker = new mapboxgl.Marker()
      .setLngLat([waypoint.longitude, waypoint.latitude])
      .setPopup( new mapboxgl.Popup({ offset: 25 })
      .setHTML('<h3>' + waypoint.languagesText.title[localLang] + '</h3><p>' + waypoint.languagesText.description[localLang] + '</p>'))
      .addTo(this.map);
      this.waypointMarkers.push(marker);
    });
  }
  
}
