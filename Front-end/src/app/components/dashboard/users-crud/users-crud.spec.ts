import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCrud } from './users-crud';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('UsersCrud', () => {
  let component: UsersCrud;
  let fixture: ComponentFixture<UsersCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersCrud],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
