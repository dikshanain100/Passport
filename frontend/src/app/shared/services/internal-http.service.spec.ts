import { TestBed } from '@angular/core/testing';

import { InternalHttpService } from './internal-http.service';

describe('InternalHttpService', () => {
  let service: InternalHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
