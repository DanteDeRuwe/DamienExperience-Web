import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route } from 'src/app/models/route.model';
import { DatePipe, formatDate } from '@angular/common';


@Component({
  selector: 'app-add-route-form',
  templateUrl: './add-route-form.component.html',
  styleUrls: ['./add-route-form.component.scss']
})
export class AddRouteFormComponent implements OnInit {
  
  
  public routeForm: FormGroup;
  @Output()
  public updateEvent = new EventEmitter<any>();
  @Output()
  public startstopEvent = new EventEmitter<boolean>();
  @Output()
  public finishedEvent = new EventEmitter();
  @Output()
  public undoEvent = new EventEmitter();


  hasStartedRecording : boolean
  tourName: string

  @Input()
  distance: number;

  constructor(private fb: FormBuilder) { }
  
  ngOnInit(): void {
    //mabye add color too
    this.routeForm = this.fb.group({
      tourName: ['', [Validators.required,Validators.minLength(4)]],
      date : ['',Validators.required],
      info_nl : ['',[Validators.required,Validators.minLength(4)]],
      info_fr : ['',[Validators.required,Validators.minLength(4)]]
    });

    this.hasStartedRecording = false
  }


  onSubmit(){
    this.finishedEvent.emit(this.routeForm.value)
  }

  getErrorMessage(errors: any): string {
    const localLang: string = localStorage.getItem("lang");
    if (!errors) {
      return null;
    }
    if(localLang == 'nl'){
      if (errors.required) {
        return 'Dit is verplicht';
      } else if (errors.minlength) {
        return `Heeft op zijn minst ${errors.minlength.requiredLength} karakters nodig (heeft ${errors.minlength.actualLength})`;
      } 
    }else if(localLang == 'fr'){
      if (errors.required) {
        return "C'est obligatoire";
      } else if (errors.minlength) {
        return `Nécessite au moins ${errors.minlength.requiredLength} caractères (prend ${errors.minlength.actualLength})`;
      }
    }
  }
  setRouteFields(route: Route) {
    this.routeForm.controls['tourName'].setValue(route.tourName) 
    var date = this.formatDate(route.date)
    this.routeForm.controls['date'].patchValue(date)
    this.routeForm.controls['info_nl'].setValue(route.info.nl)
    this.routeForm.controls['info_fr'].setValue(route.info.fr)
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  
  undo(){
      this.undoEvent.emit()
  }
  start(){
    this.startstopEvent.emit(true)
    this.hasStartedRecording = true
  }
  stop(){
    this.startstopEvent.emit(false)
    this.hasStartedRecording = false
  }

}
