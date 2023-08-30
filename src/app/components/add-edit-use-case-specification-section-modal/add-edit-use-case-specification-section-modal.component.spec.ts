import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddEditUseCaseSpecificationSectionModalComponent } from './add-edit-use-case-specification-section-modal.component';

describe('AddEditUseCaseSpecificationSectionModalComponent', () => {
  let component: AddEditUseCaseSpecificationSectionModalComponent;
  let fixture: ComponentFixture<AddEditUseCaseSpecificationSectionModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditUseCaseSpecificationSectionModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditUseCaseSpecificationSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
