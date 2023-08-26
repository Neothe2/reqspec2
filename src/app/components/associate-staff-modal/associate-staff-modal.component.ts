import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-associate-staff-modal',
  templateUrl: './associate-staff-modal.component.html',
  styleUrls: ['./associate-staff-modal.component.scss'],
})
export class AssociateStaffModalComponent implements OnInit {
  @Input() actorId!: string | null;
  @Input() clientId!: string | null;
  @Input() projectId!: string | null;
  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) {
    // this.actorId = this.route.snapshot.paramMap.get('actorId');
    // this.clientId = this.route.snapshot.paramMap.get('id');
    // this.projectId = this.route.snapshot.paramMap.get('projectId');
  }

  ngOnInit() {
    if (this.actorId && this.clientId && this.projectId) {
      this.getData();
    }
  }

  getData() {
    this.http
      .get(`api/clients/${this.clientId}/projects/${this.projectId}/staff/`)
      .then((staff) => {
        console.log(staff);
      });
  }

  dismissModal() {}
}
