import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-add-edit-use-case-specification-section-modal',
  templateUrl: './add-edit-use-case-specification-section-modal.component.html',
  styleUrls: ['./add-edit-use-case-specification-section-modal.component.scss'],
})
export class AddEditUseCaseSpecificationSectionModalComponent {
  projectForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams
  ) {
    this.projectForm = this.formBuilder.group({
      body: [''],
    });

    const defaultbody = this.navParams.get('defaultBody');
    this.projectForm.get('body')?.setValue(defaultbody);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  addProject() {
    const title = this.projectForm.get('body')?.value;
    // console.log('Client Title:', Title);
    this.modalController.dismiss(title);
  }
}
