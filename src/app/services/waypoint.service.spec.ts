import { TestBed } from '@angular/core/testing';

import { WaypointService } from './waypoint.service';

describe('WaypointService', () => {
  let service: WaypointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaypointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
