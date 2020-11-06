import { Component, OnInit } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgForm } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {

  tourName: string;
  userName: string;
  visible: boolean = true;

  public searchForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    console.log(this.tourName, this.userName)
    this.searchForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  onSubmitSearch(){
    this.userName = this.searchForm.value.username;
    this.tourName = "RouteZero";
    this.visible = false
  }

  get tourname(){
    return this.tourName;
  }

  get username(){
    return this.userName
  }
}