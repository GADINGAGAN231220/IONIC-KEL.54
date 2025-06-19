import { TestBed } from '@angular/core/testing';

import { PesananService } from './pesanan.service';

describe('PesananService', () => {
  let service: PesananService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PesananService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
