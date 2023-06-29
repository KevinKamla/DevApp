import { TestBed } from '@angular/core/testing';

import { PrintserviceService } from './printservice.service';

describe('PrintserviceService', () => {
  let service: PrintserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
