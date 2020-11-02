import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route } from '../map/model/route.model';
import { RouteDataService } from '../map/services/route-data.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registration: FormGroup;
  routes: Route[];

  tourName: string;
  userName: string;

  constructor(private fb: FormBuilder,
    private _rds: RouteDataService
    ) { }

  ngOnInit(): void {
    this.registration= this.fb.group({
      route: ['', Validators.required],
      orderedShirt: ['', Validators.required],
      sizeShirt: ['']
    });

    this._rds.getFutureRoutes$().subscribe(routes => {
      console.log(routes);
      this.routes = routes;
    });

  }

  onChange(value){
    //console.log(this.routes[value[0]])
    //console.log(this.routes[value[0]].tourName)
    // console.log(this.tourname)
    // console.log(this.username)
    // this.tourName = this.routes[value[0]].tourName
    this.tourName = "RouteZero";
  }

  onSubmitRegistration(){

  }

  get tourname(){
    return this.tourName;
  }

  get username(){
    return this.userName
  }
}
