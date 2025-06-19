import { TestBed } from '@angular/core/testing';

import { ValidasiService } from './validasi.service';

describe('ValidasiService', () => {
  let service: ValidasiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidasiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
