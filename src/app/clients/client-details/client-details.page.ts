import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AddEditProjectModalComponent } from 'src/app/components/add-edit-project-modal/add-edit-project-modal.component';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.page.html',
  styleUrls: ['./client-details.page.scss'],
})
export class ClientDetailsPage implements OnInit {
  client: any;
  projects: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.getClientDetails(clientId);
    }
  }

  getClientDetails(id: string) {
    this.http.get(`api/clients/${id}`).then((data: any) => {
      this.client = data;
      this.projects = data.projects; // Assuming projects are part of the client object
    });
  }

  async openActionSheet(project: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            this.onEditProject(project);
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.http
              .delete(`api/clients/${this.client.id}/projects/${project.id}/`)
              .then(() => {
                this.getClientDetails(this.client.id);
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

  async onAddProject() {
    const modal = await this.modalController.create({
      component: AddEditProjectModalComponent,
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        // Handle the added project data here
        this.http
          .post(`api/clients/${this.client.id}/projects/`, {
            client: this.client.id,
            title: data.data,
          })
          .then(() => {
            this.getClientDetails(this.client.id);
          });
      }
    });

    return await modal.present();
  }

  async onEditProject(project: any) {
    const modal = await this.modalController.create({
      component: AddEditProjectModalComponent,
      componentProps: { defaultTitle: project.title },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        // Handle the added project data here
        this.http
          .patch(`api/clients/${this.client.id}/projects/${project.id}/`, {
            title: data.data,
          })
          .then(() => {
            this.getClientDetails(this.client.id);
          });
      }
    });

    return await modal.present();
  }
}
