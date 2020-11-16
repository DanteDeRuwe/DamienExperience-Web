import { Component, OnInit } from '@angular/core';
import { Route } from '../map/model/route.model';
import { RouteDataService } from '../map/services/route-data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {

  constructor() { 

  }

  ngOnInit(): void {
  }
}
