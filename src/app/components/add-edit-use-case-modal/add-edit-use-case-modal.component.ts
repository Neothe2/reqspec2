import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-add-edit-use-case-modal',
  templateUrl: './add-edit-use-case-modal.component.html',
  styleUrls: ['./add-edit-use-case-modal.component.scss'],
})
export class AddEditUseCaseModalComponent {
  projectForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams
  ) {
    this.projectForm = this.formBuilder.group({
      title: [''],
    });

    const defaultTitle = this.navParams.get('defaultTitle');
    this.projectForm.get('title')?.setValue(defaultTitle);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  addProject() {
    const title = this.projectForm.get('title')?.value;
    // console.log('Client Title:', Title);
    this.modalController.dismiss(title);
  }
}
