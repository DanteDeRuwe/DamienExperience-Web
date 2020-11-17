import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss']
})
export class UserpageComponent implements OnInit {

  public isMobile: boolean = false;
  public registerActive: boolean = false;

  constructor(public bpo: BreakpointObserver) {
    bpo.observe([
      Breakpoints.Handset,
      Breakpoints.HandsetPortrait,
      Breakpoints.TabletPortrait
    ]).subscribe(result => this.isMobile = result.matches);
  }

  ngOnInit(): void { }

}
