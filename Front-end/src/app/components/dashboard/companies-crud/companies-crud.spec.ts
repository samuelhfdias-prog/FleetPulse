import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesCrud } from './companies-crud';

describe('CompaniesCrud', () => {
  let component: CompaniesCrud;
  let fixture: ComponentFixture<CompaniesCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
