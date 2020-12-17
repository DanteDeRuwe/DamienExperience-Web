import { TestBed } from '@angular/core/testing';

import { PaymentResolverService } from './payment-resolver.service';

describe('PaymentResolverService', () => {
  let service: PaymentResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
