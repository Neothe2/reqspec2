import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UseCaseDetailsPage } from './use-case-details.page';

describe('UseCaseDetailsPage', () => {
  let component: UseCaseDetailsPage;
  let fixture: ComponentFixture<UseCaseDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UseCaseDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
