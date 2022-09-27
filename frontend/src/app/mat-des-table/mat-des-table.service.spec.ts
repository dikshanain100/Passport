import { TestBed } from '@angular/core/testing';

import { MatDesTableService } from './mat-des-table.service';

describe('MatDesTableService', () => {
  let service: MatDesTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatDesTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
