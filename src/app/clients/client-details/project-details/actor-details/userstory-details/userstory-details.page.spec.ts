import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserstoryDetailsPage } from './userstory-details.page';

describe('UserstoryDetailsPage', () => {
  let component: UserstoryDetailsPage;
  let fixture: ComponentFixture<UserstoryDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserstoryDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
