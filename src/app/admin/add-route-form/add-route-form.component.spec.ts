import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRouteFormComponent } from './add-route-form.component';
import { FormBuilder } from '@angular/forms';

describe('AddRouteFormComponent', () => {
  let component: AddRouteFormComponent;
  let fixture: ComponentFixture<AddRouteFormComponent>;

  beforeEach(async(() => {
    let fromBuilderSub: Partial<FormBuilder>;

    TestBed.configureTestingModule({
      declarations: [ AddRouteFormComponent ],
      providers: [ { provide: FormBuilder, useValue: fromBuilderSub } ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRouteFormComponent);
    component = fixture.componentInstance;
    fromBuilderSub = TestBed.inject(FormBuilder);
    fixture.detectChanges();

  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('EventEmitters', () => {
    it('UpdateEmitter', () => {
      spyOn(component.updateEvent, 'emit');
      component.onSubmit();
      expect(component.updateEvent.emit).toHaveBeenCalled();      
    });

    it('StartstopEvent_start', () => {
      spyOn(component.startstopEvent, 'emit');
      component.start();
      expect(component.startstopEvent.emit).toHaveBeenCalled(); 
      expect(component.startstopEvent.emit).toHaveBeenCalledWith(true);     
    });
    it('StartstopEvent_stop', () => {
      spyOn(component.startstopEvent, 'emit');
      component.stop();
      expect(component.startstopEvent.emit).toHaveBeenCalled(); 
      expect(component.startstopEvent.emit).toHaveBeenCalledWith(false);     
    });
  });
});
