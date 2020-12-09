import { TestBed } from '@angular/core/testing';

import { DatainjectionService } from './datainjection.service';

describe('DatainjectionService', () => {
  let service: DatainjectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatainjectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
