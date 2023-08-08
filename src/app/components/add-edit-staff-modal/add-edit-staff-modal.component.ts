import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-edit-staff-modal',
  templateUrl: './add-edit-staff-modal.component.html',
  styleUrls: ['./add-edit-staff-modal.component.scss'],
})
export class AddEditStaffModalComponent implements OnInit {
  // @Input() defaultName!: string;
  @Input() defaultRole!: string;
  staffForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.staffForm = this.formBuilder.group({
      // name: [this.defaultName || '', Validators.required],
      role: [this.defaultRole || '', Validators.required],
    });
  }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

  onSubmit() {
    if (this.staffForm.valid) {
      const staffData = this.staffForm.value;
      this.modalController.dismiss(staffData);
    }
  }
}
