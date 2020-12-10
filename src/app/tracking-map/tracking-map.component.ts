import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Waypoint } from '../models/waypoint.model';
import { Route } from '../models/route.model';
import { Walk } from '../models/walk.model';

@Component({
  selector: 'app-tracking-map',
  templateUrl: './tracking-map.component.html',
  styleUrls: ['./tracking-map.component.css']
})
export class TrackingMapComponent implements OnInit {

  @Input() walk: Walk;
  @Input() route: Route;

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  //temp hardcoded startingpoint
  lat = 50.990410;
  lng = 4.708955;

  constructor(public translate: TranslateService) { }

  ngOnInit() {
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

  ngOnChanges(changes: SimpleChanges) {
    if (!!this.map) this.map.triggerRepaint();
    this.loadRoute();
    this.loadWalk();
  }

  private removeMapLayerAndSource(layerName: string) {
    if (this.map != null) {
      var mapLayer = this.map.getLayer(layerName);

      if (typeof mapLayer !== 'undefined') {
        // Remove map layer & source.
        this.map.removeLayer(layerName).removeSource(layerName);
      }
    }
  }

  loadRoute() {
    if (!!this.route) {
      let color: string = this.route.path.lineColor == null ? "#FE0040" : this.route.path.lineColor;
      this.removeMapLayerAndSource("route");
      this.addMapLine("route", color, this.route.path.coordinates);
      this.addWaypoints(this.route.waypoints);
    }
  }

  loadWalk() {
    if (!!this.walk) {
      let color: string = this.walk.walkedPath.lineColor == null ? "#3bb7a9" : this.walk.walkedPath.lineColor;
      this.removeMapLayerAndSource("walk");

      let coords = this.walk.walkedPath.coordinates;
      this.addMapLine("walk", color, coords)
    }
  }

  private addMapLine(name: string, color: string, coords: any) {
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

  addWaypoints(waypoints: Waypoint[]) {
    let localLang: string = localStorage.getItem("lang");
    waypoints.forEach(waypoint => {
      var marker = new mapboxgl.Marker()
        .setLngLat([waypoint.longitude, waypoint.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML('<h3>' + waypoint.languagesText.title[localLang] + '</h3><p>' + waypoint.languagesText.description[localLang] + '</p>'))
        .addTo(this.map);
    });
  }
}