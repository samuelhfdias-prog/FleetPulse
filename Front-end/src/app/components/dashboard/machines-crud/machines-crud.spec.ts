import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesCrud } from './machines-crud';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('MachinesCrud', () => {
  let component: MachinesCrud;
  let fixture: ComponentFixture<MachinesCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachinesCrud],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MachinesCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
