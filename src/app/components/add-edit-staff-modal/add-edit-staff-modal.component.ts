import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-add-edit-staff-modal',
  templateUrl: './add-edit-staff-modal.component.html',
  styleUrls: ['./add-edit-staff-modal.component.scss'],
})
export class AddEditStaffModalComponent implements OnInit {
  // @Input() defaultName!: string;
  @Input() defaultRole!: string;
  staffForm!: FormGroup;
  existingStaff: any[] = [];
  @Input() clientId!: string | null;
  @Input() projectId!: string | null;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private http: HttpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const defaultRole = this.navParams.get('defaultRole');
    this.staffForm = this.formBuilder.group({
      // name: [this.defaultName || '', Validators.required],
      role: [defaultRole || '', Validators.required],
    });
    console.log(this.defaultRole);

    // this.clientId = this.route.snapshot.paramMap.get('id');
    // this.projectId = this.route.snapshot.paramMap.get('projectId');
    console.log(this.clientId);
    console.log(this.projectId);
    if (this.clientId && this.projectId) {
      this.http
        .get(`api/clients/${this.clientId}/projects/${this.projectId}/`)
        .then((data: any) => {
          console.log(data);
          for (let actor of data.actors) {
            for (let staff of actor.staff) {
              if (!this.existingStaff.includes(staff)) {
                this.existingStaff.push(staff);
              }
            }
          }
          console.log('these are the existing staff:');
          console.log(this.existingStaff);
        });
    }
  }

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
