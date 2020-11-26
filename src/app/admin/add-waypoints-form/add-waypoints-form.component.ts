import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-waypoints-form',
  templateUrl: './add-waypoints-form.component.html',
  styleUrls: ['./add-waypoints-form.component.css']
})
export class AddWaypointsFormComponent implements OnInit {

  public waypointForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

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
        
  }

}
