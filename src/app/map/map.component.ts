import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as turf from '@turf/turf'
import { Walk } from './model/walk.model';
import { RouteDataService } from './services/route-data.service';
import { WalkDataService } from './services/walk-data.service';
import { Observable } from 'rxjs';
import { polygon } from '@turf/helpers';

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
  
  //temp hardcoded startingpoint
  lat = 50.990410;
  lng = 4.708955;

  //temporary json for checkpoints
  // waypoints = {
  //   features: [
  //     {
  //       title: "Delhaize Tremelo",
  //       description: "Gratis blikje frisdrank en snoepreep bij vertoon van een geldige coupon.",
  //       coordinates: {
  //         longitude: 4.705204,
  //         latitude: 50.990410
  //       }
  //     },
  //     {
  //       title: "Bevoorrading 1",
  //       description: "Hier krijg je een appeltje voor de dorst!",
  //       coordinates: {
  //         longitude: 4.708955,
  //         latitude: 50.994423
  //       }
  //     },
  //     {
  //       title: "Voetbalveld",
  //       description: "Wachtpost rode kruis",
  //       coordinates: {
  //         longitude: 4.702002,
  //         latitude: 50.986546
  //       }
  //     }
  //   ]
  // }


  constructor(
      private _rds: RouteDataService,
      private _wds: WalkDataService,
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
    this.map.on('load', () => {
    this.loadRoute()
  });
  }

  ngOnChanges(changes: SimpleChanges){
    let temp = changes.tourName.currentValue;

    this.oldTour = this.currentTour
    this.currentTour = temp
      
    if(typeof changes.userName != 'undefined'){
      this.userName = changes.userName.currentValue;
    }

    if(this.map != null){
      var mapLayer = this.map.getLayer(this.currentTour);

      if(typeof mapLayer !== 'undefined') {
        // Remove map layer & source.
        this.map.removeLayer(this.currentTour).removeSource(this.currentTour);
      }

      var mapLayerTwo = this.map.getLayer(this.oldTour);

      if(typeof mapLayerTwo !== 'undefined') {
        // Remove map layer & source.
        this.map.removeLayer(this.oldTour).removeSource(this.oldTour);
      }
    }

    this.loadRoute();
  }

  loadRoute(){
    //indien problemen met async gebruik forkJoin()?
      if(this.tourName != null){
        this._rds.getRoute$(this.tourName).subscribe(route => {
          let color: string = route.lineColor == null ? "#FE0040" : route.lineColor;
          this.addRoute(route.tourName, color, route.coordinates);
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
}
