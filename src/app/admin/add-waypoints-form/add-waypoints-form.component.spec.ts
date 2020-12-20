import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWaypointsFormComponent } from './add-waypoints-form.component';

describe('AddWaypointsFormComponent', () => {
  let component: AddWaypointsFormComponent;
  let fixture: ComponentFixture<AddWaypointsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWaypointsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWaypointsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
