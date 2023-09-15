import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-associate-actor-modal',
  templateUrl: './associate-actor-modal.component.html',
  styleUrls: ['./associate-actor-modal.component.scss'],
})
export class AssociateActorModalComponent implements OnInit {
  @Input() staffId!: string | null;
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
    if (this.staffId && this.clientId && this.projectId) {
      this.getData();
    }
  }

  getData() {
    this.http
      .get(
        `api/clients/${this.clientId}/projects/${this.projectId}/staff/${this.staffId}/unassociated_actors/`
      )
      .then((unassociated_actors: any) => {
        this.actorList = unassociated_actors;
      });
  }

  actorList: any[] = []; // This should be populated with your staff data
  checkedItems: any[] = [];

  // Sample data (you should fetch the actual data)
  // staffList = [
  //   { id: 1, name: 'John Doe' },
  //   { id: 2, name: 'Jane Smith' },
  //   // ... other staff members
  // ];

  updateCheckedItems(staffMember: any, event: any) {
    if (event.detail.checked) {
      // Add the staff member to the checkedItems array
      this.checkedItems.push(staffMember);
    } else {
      // Remove the staff member from the checkedItems array
      const index = this.checkedItems.findIndex(
        (item) => item.id === staffMember.id
      );
      if (index > -1) {
        this.checkedItems.splice(index, 1);
      }
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  submit() {
    this.modalController.dismiss(this.checkedItems);
  }
}
