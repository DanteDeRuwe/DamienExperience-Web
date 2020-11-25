import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRouteFormComponent } from './add-route-form.component';

describe('AddRouteFormComponent', () => {
  let component: AddRouteFormComponent;
  let fixture: ComponentFixture<AddRouteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRouteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRouteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
