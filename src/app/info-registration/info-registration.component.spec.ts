import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoRegistrationComponent } from './info-registration.component';

describe('InfoRegistrationComponent', () => {
  let component: InfoRegistrationComponent;
  let fixture: ComponentFixture<InfoRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
