import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Waypoint } from 'src/app/models/waypoint.model';

@Component({
  selector: 'app-add-waypoints-form',
  templateUrl: './add-waypoints-form.component.html',
  styleUrls: ['./add-waypoints-form.component.css']
})
export class AddWaypointsFormComponent implements OnInit {
  @Input()
  public pointChosen: boolean;

  public waypointForm: FormGroup;

  @Input() 
  waypoints: Waypoint[];
  
  @Output()
  public addWaypointToMapEvent = new EventEmitter();

  @Output()
  public saveAddedWaypointEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder) { 
  }

  ngOnInit(): void {

    this.waypointForm = this.formBuilder.group({
      titleGroup: this.formBuilder.group({
        titleDutch: ['', [Validators.required,Validators.minLength(4)]],
        titleFrench: ['', [Validators.required,Validators.minLength(4)]]
      }),
      descriptionGroup: this.formBuilder.group({
        descriptionDutch: ['', [Validators.required,Validators.minLength(4)]],
        descriptionFrench: ['', [Validators.required,Validators.minLength(4)]]
      })
    })

    
  }

  getErrorMessage(errors: any): string {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      return 'Dit is verplicht';
    } else if (errors.minlength) {
      return `Heeft op zijn minst ${errors.minlength.requiredLength} karakters nodig (heeft ${errors.minlength.actualLength})`;
    } 
  }

  onSubmit(){
    this.saveAddedWaypointEvent.emit(this.waypointForm.value);
    this.waypointForm.reset()
    this.pointChosen = false
  }

  addWaypoint(){
    this.addWaypointToMapEvent.emit();
  }

  saveAll(){

  }

  chosePoint(){
    this.pointChosen = true
  }

  getWaypointTitle(waypoint : Waypoint): string {
    const localLang: string = localStorage.getItem("lang");
    var title = waypoint.languagesText['title'][localLang];

    return title;
  }
  
  getWaypointDescription(waypoint : Waypoint): string {
    const localLang: string = localStorage.getItem("lang");
    var description = waypoint.languagesText['description'][localLang];

    return description;
  }

}
