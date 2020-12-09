import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss']
})
export class SponsorsComponent implements OnInit {

  public sponsors: string[] = ["ASA", "coca-cola", "colruyt", "Decathlon", "r2", "spotify", "streamz", "vrt", "vw"] //todo get from service

  constructor() { }

  ngOnInit(): void { }

}
