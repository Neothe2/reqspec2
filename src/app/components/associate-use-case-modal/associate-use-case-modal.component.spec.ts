import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssociateUseCaseModalComponent } from './associate-use-case-modal.component';

describe('AssociateUseCaseModalComponent', () => {
  let component: AssociateUseCaseModalComponent;
  let fixture: ComponentFixture<AssociateUseCaseModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateUseCaseModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssociateUseCaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
