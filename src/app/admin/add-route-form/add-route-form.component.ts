import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route } from 'src/app/models/route.model';
import { TranslateService } from '@ngx-translate/core';


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

  constructor(private fb: FormBuilder,private translate: TranslateService) { }
  
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
