import { TestBed } from '@angular/core/testing';

import { ServiceproduitService } from './serviceproduit.service';

describe('ServiceproduitService', () => {
  let service: ServiceproduitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceproduitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
