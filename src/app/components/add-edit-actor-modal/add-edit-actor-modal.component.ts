import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-add-edit-actor-modal',
  templateUrl: './add-edit-actor-modal.component.html',
  styleUrls: ['./add-edit-actor-modal.component.scss'],
})
export class AddEditActorModalComponent implements OnInit {
  actorForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams
  ) {
    this.actorForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    const defaultName = this.navParams.get('defaultName');
    this.actorForm.get('name')?.setValue(defaultName);
  }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

  onSubmit() {
    if (this.actorForm.valid) {
      const actorData = this.actorForm.value;
      // You can send the actorData to the parent component or call an API here
      this.modalController.dismiss(actorData);
    }
  }
}
