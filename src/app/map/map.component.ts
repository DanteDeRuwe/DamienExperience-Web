import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as turf from '@turf/turf'
import { Walk } from './model/walk.model';
import { RouteDataService } from './services/route-data.service';
import { WalkDataService } from './services/walk-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  
  @Input() tourName: string;
  @Input() userName: string;

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
    //aanmaken van de map, de accessToken is nodig om toegang te krijgen 
    //container is het element waar de map in moet in de html (deze moet dan ook een height krijgen anders krijg je niks te zien)
    //style is de stijl van de kaart, op mapbox kan je verschillende themas terugvinden
    //zoom is het zoomniveau
    //center is de focus van de kaart(dit moeten we nog veranderen en het automatisch laten berekenen?)
    this.map = new mapboxgl.Map({
      accessToken: environment.accessToken,
      container: 'map',
      style: this.style,
      zoom: 14,
      center: [this.lng, this.lat],
    })

    //controls toevoegen aan de map
    this.map.addControl(new mapboxgl.NavigationControl());
    
    //tekent de waypoints op de kaart door een nieuw Marker object aan te maken
    //dit maakt een nieuw div element aan waarop er styling moet worden toegepast (zie css)
    //aan de popup wordt er html toegevoegd om tekst te verschijnen
    //voor de waypoints kan een eigen svg ingesteld worden
    
    
    // this.waypoints.features.forEach((waypoint) => {
    //   var marker = new mapboxgl.Marker()
    //   .setLngLat([waypoint.coordinates.longitude, waypoint.coordinates.latitude])
    //   .setPopup( new mapboxgl.Popup({ offset: 25 })
    //     .setHTML('<h3>' + waypoint.title + '</h3><p>' + waypoint.description + '</p>'))
    //   .addTo(this.map);

    // });

    //manier om de afstand te berekenen [POC]
    //de coordinaten worden in een linestring omgezet en daarvan kan dan de lengte worden berekend
    // let lineString = turf.lineString(this.route.features[0].geometry.coordinates);
    // let distance = turf.length(lineString);
    // console.log(distance);
    
    //zorgt ervoor dat vanzodra de map geladen wordt, de routes getekend worden [POC]
    this.map.on('load', () => {
    this.loadRoute()
  });
  }

  ngOnChanges(changes: SimpleChanges){
    //console.log(changes.tourName.currentValue)
    //console.log(changes.userName.currentValue)
    this.tourName = changes.tourName.currentValue;
    if(typeof changes.userName != 'undefined'){
      this.userName = changes.userName.currentValue;
    }
    
    this.loadRoute();
  }

  loadRoute(){
      if(this.tourName != null){
        this._rds.getRoute$(this.tourName).subscribe(route => {
          let color: string = route.lineColor == null ? "#FE0040" : route.lineColor;
          this.addRoute(route.tourName, color, route.coordinates);
        });
      }
    
      if(this.userName != null && this.userName != "" && typeof this.userName != 'undefined'){
        this._wds.getWalk$(this.userName).subscribe(walk => {
          let color: string = walk.lineColor == null ? "#3bb7a9" : walk.lineColor;
          this.addRoute(walk.id, color, walk.coordinates)
        });
      }
  }

  //Code in deze method can gerefactored en ge extract worden, is op dit moment afhankelijk van de data van BE
  private addRoute(name: string, color: string, coords: any) {
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
