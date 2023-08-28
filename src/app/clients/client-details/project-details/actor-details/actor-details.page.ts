import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http/http.service';
import { AddEditStaffModalComponent } from '../../../../components/add-edit-staff-modal/add-edit-staff-modal.component';
import { AssociateStaffModalComponent } from 'src/app/components/associate-staff-modal/associate-staff-modal.component';
import { AddEditUserstoryFromProjectComponent } from 'src/app/components/add-edit-userstory-from-project/add-edit-userstory-from-project.component';

@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.page.html',
  styleUrls: ['./actor-details.page.scss'],
})
export class ActorDetailsPage implements OnInit {
  actor: any;

  staff: any[] = [];
  userStories: any[] = [];

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
        console.log('something');
        console.log(data);
        this.actor = data;
        this.staff = data.staff;
        this.userStories = data.user_stories;
        console.log('User stories:');
        console.log(this.userStories);
        // this.http
        //   .get(`api/clients/${this.clientId}/projects/${this.projectId}/staff/`)
        //   .then((staff: any) => {
        //     console.log(staff);
        //     for (let staffId of staffIds) {
        //       this.staff = (staff.results as any[]).filter(
        //         (staff) => (staff.id = staffId)
        //       );
        //     }
        //   });
      });
  }

  async onAddUserStory() {
    const modal = await this.modalController.create({
      component: AddEditUserstoryFromProjectComponent,
      componentProps: {
        clientId: this.clientId,
        projectId: this.projectId,
        fromActorDetail: true,
      },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        this.http
          .post(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/${data.data.actor}/user_stories/`,
            {
              story: data.data.story,
              actor: this.actorId,
            }
          )
          .then(() => {
            this.getActorDetails();
          });
        console.log(data.data);
      }
    });

    return await modal.present();
  }

  navigateToDetailUserStory(userStory: any) {}

  async onEditUserStory(userStory: any) {
    const modal = await this.modalController.create({
      component: AddEditUserstoryFromProjectComponent,
      componentProps: {
        defaultStory: userStory.story,
        defaultActorId: userStory.actor,
        clientId: this.clientId,
        projectId: this.projectId,
        fromActorDetail: true,
      },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        this.http
          .patch(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/${userStory.actor}/user_stories/${userStory.id}/`,
            { story: data.data.story }
          )
          .then(() => {
            this.getActorDetails();
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

  async onAddStaff() {
    const modal = await this.modalController.create({
      component: AssociateStaffModalComponent,
      componentProps: {
        clientId: this.clientId,
        projectId: this.projectId,
        actorId: this.actorId,
      },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        console.log(data.data);
        console.log(data);
        let staffIds = [];
        for (let staff of data.data) {
          staffIds.push(staff.id);
        }
        let existingStaff = [];

        for (let staffObject of this.actor.staff) {
          existingStaff.push(staffObject.id);
        }
        this.http
          .patch(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actor.id}/`,
            {
              //  : data.data. ,
              staff: [...staffIds, ...existingStaff],
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
          text: 'Remove',
          handler: () => {
            console.log(
              this.actor.staff.filter(
                (staffinlist: any) => staffinlist.id != staff.id
              )
            );

            let staffObjectList = this.actor.staff.filter(
              (staffinlist: any) => staffinlist.id != staff.id
            );
            let staffIdList = [];
            for (let staffObject of staffObjectList) {
              staffIdList.push(staffObject.id);
            }
            this.http
              .patch(
                `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actorId}/`,
                {
                  staff: staffIdList,
                }
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
        defaultRole: staff.name,
        clientId: this.clientId,
        projectId: this.projectId,
      },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        this.http
          .patch(
            `api/clients/${this.clientId}/projects/${this.projectId}/staff/${staff.id}/`,
            {
              //  : data.data. ,
              name: data.data.role,
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
