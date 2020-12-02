import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRouteDialogComponent } from './delete-route-dialog.component';

describe('DeleteRouteDialogComponent', () => {
  let component: DeleteRouteDialogComponent;
  let fixture: ComponentFixture<DeleteRouteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteRouteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRouteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
