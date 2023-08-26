import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http/http.service';
import { AddEditStaffModalComponent } from '../../../../components/add-edit-staff-modal/add-edit-staff-modal.component';

@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.page.html',
  styleUrls: ['./actor-details.page.scss'],
})
export class ActorDetailsPage implements OnInit {
  actor: any;
  staff: any[] = [];

  clientId: string | null = '';
  projectId: string | null = '';
  actorId: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.actorId = this.route.snapshot.paramMap.get('actorId');
    this.clientId = this.route.snapshot.paramMap.get('id');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    console.log(this.actorId);
    console.log(this.clientId);
    console.log(this.projectId);
    if (this.actorId && this.clientId && this.projectId) {
      this.getActorDetails();
    }
  }

  getActorDetails() {
    this.http
      .get(
        `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actorId}`
      )
      .then((data: any) => {
        this.actor = data;
        let staffIds = data.staff;
        this.http
          .get(`api/clients/${this.clientId}/projects/${this.projectId}/staff/`)
          .then((staff) => {
            for (let staffId of staffIds) {
            }
          });
      });
  }

  async onAddStaff() {
    const modal = await this.modalController.create({
      component: AddEditStaffModalComponent,
      componentProps: { clientId: this.clientId, projectId: this.projectId },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        console.log(data.data);
        console.log(data);
        this.http
          .post(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actor.id}/staff/`,
            {
              // name: data.data.name,
              role: data.data.role,
              actors: [this.actor.id],
            }
          )
          .then(() => {
            this.getActorDetails();
          });
      }
    });

    return await modal.present();
  }

  async openActionSheet(staff: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            this.onEditStaff(staff);
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.http
              .delete(
                `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actor.id}/staff/${staff.id}/`
              )
              .then(() => {
                this.getActorDetails();
              });
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async onEditStaff(staff: any) {
    console.log(staff);
    const modal = await this.modalController.create({
      component: AddEditStaffModalComponent,
      componentProps: {
        defaultRole: staff.role,
        clientId: this.clientId,
        projectId: this.projectId,
      },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        this.http
          .patch(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actor.id}/staff/${staff.id}/`,
            {
              // name: data.data.name,
              role: data.data.role,
            }
          )
          .then(() => {
            this.getActorDetails();
          });
      }
    });

    return await modal.present();
  }
}
