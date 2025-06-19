import { TestBed } from '@angular/core/testing';

import { LaporanService } from './laporan.service';

describe('LaporanService', () => {
  let service: LaporanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaporanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
