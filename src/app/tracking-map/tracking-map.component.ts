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

    this.map.on('load', () => {
      this.addLocationIndicatorImage();
    })
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
      this.refreshLocationIndicator(coords[coords.length - 1])
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

  refreshLocationIndicator(coords: any) {
    try {
      this.removeMapLayerAndSource("location")
    }
    catch (e) { }
    finally {
      this.map.addSource('location', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'Point',
            'coordinates': coords
          }
        }
      });

      this.map.addLayer({
        'id': 'location',
        'type': 'symbol',
        'source': 'location',
        'layout': {
          'icon-image': 'pulsing-dot'
        }
      });
    }

    this.map.flyTo({
      center: coords,
      speed: 0.5
    });
  }

  addLocationIndicatorImage() {
    let size = 100;
    let pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // get rendering context for the map canvas when layer is added to the map
      onAdd: function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      // called once before every frame where the icon will be used
      render: function () {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        if (!!this.map) this.map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
      }
    };

    this.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
  }
}