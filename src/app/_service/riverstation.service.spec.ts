import { TestBed } from '@angular/core/testing';

import { RiverstationService } from './riverstation.service';

describe('RiverstationService', () => {
  let service: RiverstationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiverstationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
