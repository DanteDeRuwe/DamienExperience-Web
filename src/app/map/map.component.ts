import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  
  //temp hardcoded staringpoint
  lat = 50.997361;
  lng = 4.716358;

  //temporary json for checkpoints
  waypoints = {
    features: [
      {
        title: "Delhaize Tremelo",
        description: "Gratis blikje frisdrank en snoepreep bij vertoon van een geldige coupon.",
        coordinates: {
          longitude: 4.705204,
          latitude: 50.990410
        }
      },
      {
        title: "Bevoorrading 1",
        description: "Hier krijg je een appeltje voor de dorst!",
        coordinates: {
          longitude: 4.708955,
          latitude: 50.994423
        }
      },
      {
        title: "Voetbalveld",
        description: "Wachtpost rode kruis",
        coordinates: {
          longitude: 4.702002,
          latitude: 50.986546
        }
      }
    ]
  }
  

  constructor() { }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
    })

    this.map.addControl(new mapboxgl.NavigationControl());
    
    this.waypoints.features.forEach((waypoint) => {
      var marker = new mapboxgl.Marker()
      .setLngLat([waypoint.coordinates.longitude, waypoint.coordinates.latitude])
      .setPopup( new mapboxgl.Popup({ offset: 25 })
        .setHTML('<h3>' + waypoint.title + '</h3><p>' + waypoint.description + '</p>'))
      .addTo(this.map);

    })
  }

}
