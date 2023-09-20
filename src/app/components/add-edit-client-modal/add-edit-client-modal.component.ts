import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';

@Component({
  selector: 'app-add-edit-client-modal',
  templateUrl: './add-edit-client-modal.component.html',
  styleUrls: ['./add-edit-client-modal.component.scss'],
})
export class AddEditClientModalComponent {
  clientForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private shortcutService: ShortcutService
  ) {
    this.clientForm = this.formBuilder.group({
      name: [''],
    });

    const defaultName = this.navParams.get('defaultName');
    this.clientForm.get('name')?.setValue(defaultName);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  addClient() {
    const name = this.clientForm.get('name')?.value;
    console.log('Client Name:', name);
    this.modalController.dismiss(name);
  }
}
