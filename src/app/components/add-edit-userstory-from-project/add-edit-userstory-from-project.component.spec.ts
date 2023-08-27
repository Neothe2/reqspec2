import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddEditUserstoryFromProjectComponent } from './add-edit-userstory-from-project.component';

describe('AddEditUserstoryFromProjectComponent', () => {
  let component: AddEditUserstoryFromProjectComponent;
  let fixture: ComponentFixture<AddEditUserstoryFromProjectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditUserstoryFromProjectComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditUserstoryFromProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
