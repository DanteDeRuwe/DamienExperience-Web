import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {

  tourName$: Observable<string>;
  userName$: Observable<string>;
  visible: boolean = true;

  public searchForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    //this.tourName = 'RouteZero';
    //this.userName = 't@tt.te';
    this.searchForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  onSubmitSearch(){
    this.userName$ = this.searchForm.value.username;
    this.tourName$ = Observable.apply("RouteZero")
    this.visible = false
  }
}