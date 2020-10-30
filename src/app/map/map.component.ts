import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as turf from '@turf/turf'
import { Walk } from './model/walk.model';
import { RouteDataService } from './services/route-data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  
  //temp hardcoded staringpoint
  lat = 50.990410;
  lng = 4.708955;

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
  

  route = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              4.708843231201172,
              50.9944865168635
            ],
            [
              4.703693389892578,
              50.99108304254769
            ],
            [
              4.705195426940918,
              50.99017810856411
            ],
            [
              4.70386505126953,
              50.989367704946844
            ],
            [
              4.702770709991455,
              50.989772908524195
            ],
            [
              4.702212810516357,
              50.9889895117497
            ],
            [
              4.7017621994018555,
              50.984288853430854
            ],
            [
              4.702920913696289,
              50.985342490650396
            ],
            [
              4.7046589851379395,
              50.986423119367196
            ],
            [
              4.705259799957275,
              50.98732812656122
            ],
            [
              4.705452919006348,
              50.988098044163905
            ],
            [
              4.705753326416016,
              50.988935483898565
            ],
            [
              4.70639705657959,
              50.98958381396164
            ],
            [
              4.707319736480713,
              50.98947575958004
            ],
            [
              4.711203575134277,
              50.988017000807105
            ],
            [
              4.7126305103302,
              50.987578013498705
            ],
            [
              4.714068174362183,
              50.98703096196555
            ],
            [
              4.714701175689697,
              50.98706473076542
            ],
            [
              4.715237617492676,
              50.987517230313394
            ],
            [
              4.715688228607178,
              50.98775360892028
            ],
            [
              4.7151947021484375,
              50.98873287889668
            ],
            [
              4.714980125427246,
              50.988962497832
            ],
            [
              4.7147440910339355,
              50.98909756726333
            ],
            [
              4.714454412460327,
              50.98963784105814
            ],
            [
              4.713563919067383,
              50.98965810120312
            ],
            [
              4.712855815887451,
              50.98979992197026
            ],
            [
              4.7122979164123535,
              50.98987420886582
            ],
            [
              4.711611270904541,
              50.989813428687384
            ],
            [
              4.711031913757324,
              50.989712128213114
            ],
            [
              4.710677862167358,
              50.98963108767451
            ],
            [
              4.7100770473480225,
              50.989691868091725
            ],
            [
              4.709744453430176,
              50.98975264842937
            ],
            [
              4.709347486495972,
              50.98975264842937
            ],
            [
              4.708961248397826,
              50.98973238832567
            ],
            [
              4.708864688873291,
              50.99002953562688
            ],
            [
              4.708617925643921,
              50.99038746053207
            ],
            [
              4.708296060562134,
              50.99072512300668
            ],
            [
              4.7079527378082275,
              50.99092096611637
            ],
            [
              4.70739483833313,
              50.9911235615671
            ],
            [
              4.708349704742432,
              50.99227833874959
            ],
            [
              4.709476232528686,
              50.99192042842648
            ],
            [
              4.709728360176086,
              50.992065618795955
            ],
            [
              4.710431098937988,
              50.99198795888739
            ],
            [
              4.711015820503235,
              50.991809002951186
            ],
            [
              4.711251854896545,
              50.992041983185366
            ],
            [
              4.712952375411987,
              50.9918866631592
            ],
            [
              4.713091850280762,
              50.99176510799351
            ],
            [
              4.7132956981658936,
              50.991724589534215
            ],
            [
              4.7137463092803955,
              50.991738095691225
            ],
            [
              4.713928699493408,
              50.99183939174371
            ],
            [
              4.7141969203948975,
              50.99180562641744
            ],
            [
              4.7149693965911865,
              50.991947440622646
            ],
            [
              4.7154951095581055,
              50.99200146496779
            ],
            [
              4.71637487411499,
              50.99187991010278
            ],
            [
              4.716482162475586,
              50.99444600078013
            ],
            [
              4.708929061889648,
              50.99450002221675
            ],
            [
              4.7088465839624405,
              50.99448820503287
            ],
            [
              4.708844237029552,
              50.99448546175759
            ]
          ]
        }
      }
    ]
  }


  constructor(
      private _rds: RouteDataService
    ) { 
    
  }

  ngOnInit(): void {
    //aanmaken van de map, de accessToken is nodig om toegang te krijgen 
    //container is het element waar de map in moet in de html (deze moet dan ook een height krijgen anders krijg je niks te zien)
    //style is de stijl van de kaart, op mapbox kan je verschillende themas terugvinden
    //zoom is het zoomniveau
    //center is de focus van de kaart(dit moeten we nog veranderen en het automatisch laten berekenen?)
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
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
    this.waypoints.features.forEach((waypoint) => {
      var marker = new mapboxgl.Marker()
      .setLngLat([waypoint.coordinates.longitude, waypoint.coordinates.latitude])
      .setPopup( new mapboxgl.Popup({ offset: 25 })
        .setHTML('<h3>' + waypoint.title + '</h3><p>' + waypoint.description + '</p>'))
      .addTo(this.map);

    });

    //manier om de afstand te berekenen [POC]
    //de coordinaten worden in een linestring omgezet en daarvan kan dan de lengte worden berekend
    let lineString = turf.lineString(this.route.features[0].geometry.coordinates);
    let distance = turf.length(lineString);
    console.log(distance);
    
    //zorgt ervoor dat vanzodra de map geladen wordt, de routes getekend worden [POC]
    this.map.on('load', () => {
      this.addRoutes();
    });

    this._rds.getRoute$('RouteZero').subscribe(route => {
      console.log(route)
    });
    
  }


  //Code in deze method can gerefactored en ge extract worden, is op dit moment afhankelijk van de data van BE
  private addRoutes() {
    
    // let routes: [Walk];
    // routes.forEach(route => {
    //   this.map.addSource(route.id, {
    //     'type': 'geojson',
    //     'data': {
    //       'type': 'Feature',
    //       'properties': {},
    //       'geometry': {
    //         'type': 'LineString',
    //         'coordinates': route.coordinates
    //       }
    //     }
    //   });
  
    //   this.map.addLayer({
    //     'id': route.id,
    //     'type': 'line',
    //     'source': route.id,
    //     'layout': {
    //       'line-join': 'round',
    //       'line-cap': 'round',
    //     },
    //     'paint': {
    //       'line-color': route.lineColor,
    //       'line-width': 4
    //     }
    //   });
    // })

    //Dit maakt eerst een source aan voor de route (genaamd route) en zal ze dan toevoegen aan de map adhv het id (de naam)
    this.map.addSource('route', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': this.route.features[0].geometry.coordinates
        }
      }
    });

    this.map.addLayer({
      'id': 'route',
      'type': 'line',
      'source': 'route',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
      },
      'paint': {
        'line-color': '#ff0040',
        'line-width': 4
      }
    });

    //layer en source voor walked path
    this.map.addSource('walked', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': this.route.features[0].geometry.coordinates.slice(0, 10)
        }
      }
    });

    this.map.addLayer({
      'id': 'walked',
      'type': 'line',
      'source': 'walked',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
      },
      'paint': {
        'line-color': '#3bb7a9',
        'line-width': 4
      }
    });
  }
}
