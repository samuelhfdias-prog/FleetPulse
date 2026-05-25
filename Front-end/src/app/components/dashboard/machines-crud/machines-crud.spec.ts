import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesCrud } from './machines-crud';

describe('MachinesCrud', () => {
  let component: MachinesCrud;
  let fixture: ComponentFixture<MachinesCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachinesCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(MachinesCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
