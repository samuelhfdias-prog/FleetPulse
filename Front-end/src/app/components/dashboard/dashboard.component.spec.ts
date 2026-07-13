import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { MachinesService } from '../../services/machines.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: { getCurrentUser: () => null, logout: () => undefined } },
        {
          provide: MachinesService,
          useValue: {
            getStatistics: () =>
              of({
                total: 0,
                operational: 0,
                maintenance: 0,
                idle: 0,
                inactive: 0,
                averageOperatingHours: 0,
              }),
          },
        },
      ],
    })
      .overrideComponent(DashboardComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
