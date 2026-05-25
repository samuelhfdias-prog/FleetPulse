import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCrud } from './users-crud';

describe('UsersCrud', () => {
  let component: UsersCrud;
  let fixture: ComponentFixture<UsersCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
