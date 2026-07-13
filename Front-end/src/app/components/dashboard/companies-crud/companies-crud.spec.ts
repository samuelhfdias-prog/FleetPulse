import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesCrud } from './companies-crud';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CompaniesCrud', () => {
  let component: CompaniesCrud;
  let fixture: ComponentFixture<CompaniesCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesCrud],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
