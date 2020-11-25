import { TestBed } from '@angular/core/testing';

import { WalkDataService } from './walk-data.service';

describe('WalkDataService', () => {
  let service: WalkDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalkDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
