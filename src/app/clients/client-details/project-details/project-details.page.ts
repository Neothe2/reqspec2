import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AddEditActorModalComponent } from 'src/app/components/add-edit-actor-modal/add-edit-actor-modal.component';
import { AddEditStaffModalComponent } from 'src/app/components/add-edit-staff-modal/add-edit-staff-modal.component';
import { AddEditUserstoryFromProjectComponent } from 'src/app/components/add-edit-userstory-from-project/add-edit-userstory-from-project.component';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage implements OnInit {
  project: any;
  actors: any[] = [];
  staffList: any[] = [];
  userStories: any[] = [];

  clientId: string | null = '';
  projectId: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.projectId && this.clientId) {
      this.getProjectDetails();
    }
  }

  getProjectDetails() {
    this.http
      .get(`api/clients/${this.clientId}/projects/${this.projectId}`)
      .then((data: any) => {
        console.log(data);
        this.project = data;
        this.actors = data.actors; // Assuming actors are part of the project object
        this.staffList = data.staff;
        this.userStories = [];
        for (let actor of this.actors) {
          for (let story of actor.user_stories) {
            if (!this.userStories.includes(story)) {
              this.userStories.push(story);
            }
          }
        }
      });
  }

  //                 |||
  // User Story Code VVV

  async onAddUserStory() {
    const modal = await this.modalController.create({
      component: AddEditUserstoryFromProjectComponent,
      componentProps: {
        clientId: this.clientId,
        projectId: this.projectId,
      },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        this.http
          .post(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/${data.data.actor}/user_stories/`,
            { ...data.data }
          )
          .then(() => {
            this.getProjectDetails();
          });
        console.log(data.data);
      }
    });

    return await modal.present();
  }

  navigateToDetailUserStory(userStory: any) {
    this.router.navigateByUrl(
      `clients/detail/${this.clientId}/project-details/${this.projectId}/actor-details/${userStory.actor}/userstory-details/${userStory.id}`
    );
  }

  async onEditUserStory(userStory: any) {
    const modal = await this.modalController.create({
      component: AddEditUserstoryFromProjectComponent,
      componentProps: {
        defaultStory: userStory.story,
        defaultActorId: userStory.actor,
        clientId: this.clientId,
        projectId: this.projectId,
      },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        this.http
          .patch(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/${userStory.actor}/user_stories/${userStory.id}/`,
            { ...data.data }
          )
          .then(() => {
            this.getProjectDetails();
          });
      }
    });

    return await modal.present();
  }

  async openActionSheetUserStory(userStory: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            this.onEditUserStory(userStory);
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.http
              .delete(
                `api/clients/${this.clientId}/projects/${this.projectId}/actors/${userStory.actor}/user_stories/${userStory.id}/`
              )
              .then(() => {
                this.getProjectDetails();
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

  async onAddActor() {
    const modal = await this.modalController.create({
      component: AddEditActorModalComponent,
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        this.http
          .post(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/`,
            { ...data.data, project: this.projectId }
          )
          .then(() => {
            this.getProjectDetails();
          });
      }
    });

    return await modal.present();
  }

  async onAddStaff() {
    const modal = await this.modalController.create({
      component: AddEditStaffModalComponent,
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        this.http
          .post(
            `api/clients/${this.clientId}/projects/${this.projectId}/staff/`,
            { ...data.data, project: this.projectId }
          )
          .then(() => {
            this.getProjectDetails();
          });
      }
    });

    return await modal.present();
  }

  async onEditStaff(staff: any) {
    const modal = await this.modalController.create({
      component: AddEditStaffModalComponent,
      componentProps: { defaultRole: staff.name },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        this.http
          .patch(
            `api/clients/${this.clientId}/projects/${this.projectId}/staff/${staff.id}/`,
            { ...data.data }
          )
          .then(() => {
            this.getProjectDetails();
          });
      }
    });

    return await modal.present();
  }

  async openActionSheetStaff(staff: any) {
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
                `api/clients/${this.clientId}/projects/${this.projectId}/staff/${staff.id}`
              )
              .then(() => {
                this.getProjectDetails();
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

  async editActor(actor: any) {
    const modal = await this.modalController.create({
      component: AddEditActorModalComponent,
      componentProps: { defaultRole: actor.role },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        this.http
          .patch(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/${actor.id}/`,
            { ...data.data }
          )
          .then(() => {
            this.getProjectDetails();
          });
      }
    });

    return await modal.present();
  }

  async openActionSheet(actor: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            this.editActor(actor);
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.http
              .delete(
                `api/clients/${this.clientId}/projects/${this.projectId}/actors/${actor.id}`
              )
              .then(() => {
                this.getProjectDetails();
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

  navigateToDetail(actor: any) {
    this.router.navigateByUrl(
      `/clients/detail/${this.clientId}/project-details/${this.projectId}/actor-details/${actor.id}`
    );
  }

  navigateToDetailStaff(staff: any) {
    this.router.navigateByUrl(
      `/clients/detail/${this.clientId}/project-details/${this.projectId}/staff-details/${staff.id}`
    );
  }
}
