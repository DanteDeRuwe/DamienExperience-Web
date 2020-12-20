import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Waypoint } from 'src/app/models/waypoint.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-waypoints-form',
  templateUrl: './add-waypoints-form.component.html',
  styleUrls: ['./add-waypoints-form.component.scss']
})
export class AddWaypointsFormComponent implements OnInit {
  // @Input()
  public pointChosen: boolean;

  public waypointForm: FormGroup;

  @Input() 
  waypoints: Waypoint[];
  
  @Output()
  public addWaypointToMapEvent = new EventEmitter();

  @Output()
  public saveAddedWaypointEvent = new EventEmitter();
  @Output()
  public saveDeletedWaypointEvent = new EventEmitter();
  @Output()
  public saveAllWaypointEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder,private translate: TranslateService) { 
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
    var error = ""
    if (!errors) {
      return null;
    }
    if (errors.required) {
      this.translate.get('is_required').subscribe( val => {error  = val})
      return error;
    } else if (errors.minlength) {
      this.translate.get('min_length',{ min: errors.minlength.requiredLength, now: errors.minlength.actualLength }).subscribe( val => {error  = val})
      return error    
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

  deleteWaypoint(waypoint : Waypoint){
    this.saveDeletedWaypointEvent.emit(waypoint);
  }

  saveAll(){
    this.saveAllWaypointEvent.emit();
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
