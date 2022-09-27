import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDesTableComponent } from './mat-des-table.component';

describe('MatDesTableComponent', () => {
  let component: MatDesTableComponent;
  let fixture: ComponentFixture<MatDesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatDesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
