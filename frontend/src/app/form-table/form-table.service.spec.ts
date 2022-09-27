import { TestBed } from '@angular/core/testing';

import { FormTableService } from './form-table.service';

describe('FormTableService', () => {
  let service: FormTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
