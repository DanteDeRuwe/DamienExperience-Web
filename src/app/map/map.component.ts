import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { RouteDataService } from '../services/route-data.service';
import { WalkDataService } from '../services/walk-data.service';
import { Waypoint } from '../models/waypoint.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  
  @Input() tourName: string;
  @Input() userName: string;

  currentTour: string;
  oldTour: string;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  waypoints : mapboxgl.Marker[] = []
  
  //temp hardcoded startingpoint
  lat = 50.990410;
  lng = 4.708955;

  constructor(
      private _rds: RouteDataService,
      private _wds: WalkDataService,
      public translate: TranslateService
    ) { 
    
  }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 14,
      center: [this.lng, this.lat],
    })

    //controls toevoegen aan de map
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  ngOnChanges(changes: SimpleChanges){
    let temp = changes.tourName.currentValue;

    this.oldTour = this.currentTour
    this.currentTour = temp
      
    if(typeof changes.userName != 'undefined'){
      this.userName = changes.userName.currentValue;
    }

    this.removeSources();

    this.loadRoute();
  }

  private removeSources() {
    if (this.map != null) {
      var mapLayer = this.map.getLayer(this.currentTour);

      if (typeof mapLayer !== 'undefined') {
        // Remove map layer & source.
        this.map.removeLayer(this.currentTour).removeSource(this.currentTour);
      }

      var mapLayerTwo = this.map.getLayer(this.oldTour);

      if (typeof mapLayerTwo !== 'undefined') {
        // Remove map layer & source.
        this.map.removeLayer(this.oldTour).removeSource(this.oldTour);
      }
    }
  }

  loadRoute(){
    //indien problemen met async gebruik forkJoin()?
      if(this.tourName != null){
        this._rds.getRoute$(this.tourName).subscribe(route => {
          let color: string = route.path.lineColor == null ? "#FE0040" : route.path.lineColor;
          this.addRoute(route.tourName, color, route.path.coordinates);
          this.addWaypoints(route.waypoints);
        });
      }
    
      if(this.userName != null && this.userName != "" && typeof this.userName != 'undefined'){
        this._wds.getWalk$(this.userName).subscribe(walk => {
          let color: string = walk.walkedPath.lineColor == null ? "#3bb7a9" : walk.walkedPath.lineColor;
          this.addRoute(walk.id, color, walk.walkedPath.coordinates)
        });
      }
  }

  //Code in deze method can gerefactored en ge extract worden, is op dit moment afhankelijk van de data van BE
  private addRoute(name: string, color: string, coords: any) {
    var bounds = coords.reduce(function (bounds, coord) {
      return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coords[0], coords[0]));
       
      this.map.fitBounds(bounds, {
      padding: 20
    });
    //Dit maakt eerst een source aan voor de route (genaamd route) en zal ze dan toevoegen aan de map adhv het id (de naam)
    this.map.addSource(`${name}`, {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': coords
        }
      }
    });

    this.map.addLayer({
      'id': `${name}`,
      'type': 'line',
      'source': `${name}`,
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
      },
      'paint': {
        'line-color': color,
        'line-width': 4
      }
    });
  }

  addWaypoints(waypoints: Waypoint[]){
    this.waypoints.forEach(marker => {
      marker.remove();
    });
    this.waypoints=[];
    let localLang: string = localStorage.getItem("lang");
    waypoints.forEach(waypoint => {
      var marker = new mapboxgl.Marker()
      .setLngLat([waypoint.longitude, waypoint.latitude])
      .setPopup( new mapboxgl.Popup({ offset: 25 })
      .setHTML('<h3>' + waypoint.languagesText.title[localLang] + '</h3><p>' + waypoint.languagesText.description[localLang] + '</p>'))
      .addTo(this.map);
      this.waypoints.push(marker);
      //console.log(this.waypoints)
    });
  }
}
