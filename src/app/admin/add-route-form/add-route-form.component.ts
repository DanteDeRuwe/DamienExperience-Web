import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route } from 'src/app/models/route.model';


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
