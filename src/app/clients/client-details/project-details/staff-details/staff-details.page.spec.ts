import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaffDetailsPage } from './staff-details.page';

describe('StaffDetailsPage', () => {
  let component: StaffDetailsPage;
  let fixture: ComponentFixture<StaffDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StaffDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
