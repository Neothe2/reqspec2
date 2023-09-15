import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AddEditStaffModalComponent } from 'src/app/components/add-edit-staff-modal/add-edit-staff-modal.component';
import { AddEditUserstoryFromProjectComponent } from 'src/app/components/add-edit-userstory-from-project/add-edit-userstory-from-project.component';
import { AssociateActorModalComponent } from 'src/app/components/associate-actor-modal/associate-actor-modal.component';
import { AssociateStaffModalComponent } from 'src/app/components/associate-staff-modal/associate-staff-modal.component';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.page.html',
  styleUrls: ['./staff-details.page.scss'],
})
export class StaffDetailsPage implements OnInit {
  staff: any;
  actors: any[] = [];
  userStories: any[] = [];

  clientId: string | null = '';
  projectId: string | null = '';
  staffId: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.staffId = this.route.snapshot.paramMap.get('staffId');
    this.clientId = this.route.snapshot.paramMap.get('id');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    console.log(this.staffId);
    console.log(this.clientId);
    console.log(this.projectId);
    if (this.staffId && this.clientId && this.projectId) {
      this.getStaffDetails();
    }
  }

  getStaffDetails() {
    this.http
      .get(
        `api/clients/${this.clientId}/projects/${this.projectId}/staff/${this.staffId}`
      )
      .then((data: any) => {
        console.log('something');
        console.log(data);
        this.staff = data;
        let actorIds = data.actors;
        // this.http
        //   .get(
        //     `api/clients/${this.clientId}/projects/${this.projectId}/actors/`
        //   )
        //   .then((actors: any) => {
        //     console.log(actors);
        //     //gets associated actors
        //     this.actors = [];
        //     for (let actorId of actorIds) {
        //       this.actors = [
        //         ...this.actors,
        //         ...(actors.results as any[]).filter(
        //           (actor) => actor.id == actorId
        //         ),
        //       ];

        //       // gets associated user stories
        //       this.userStories = [];
        //       for (let actor of this.actors) {
        //         for (let user_story of actor.user_stories) {
        //           this.userStories.push(user_story);
        //         }
        //       }
        //     }
        //   });

        this.http
          .get(
            `api/clients/${this.clientId}/projects/${this.projectId}/staff/${this.staffId}/associated_actors/`
          )
          .then((associatedActors: any) => {
            this.actors = associatedActors;
          });
      });
  }

  async onAddUserStory() {
    const modal = await this.modalController.create({
      component: AddEditUserstoryFromProjectComponent,
      componentProps: {
        clientId: this.clientId,
        projectId: this.projectId,
        fromStaffDetail: true,
        associatedActors: this.actors,
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
            this.getStaffDetails();
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
        fromStaffDetail: true,
        associatedActors: this.actors,
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
            this.getStaffDetails();
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
                this.getStaffDetails();
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
      component: AssociateActorModalComponent,
      componentProps: {
        clientId: this.clientId,
        projectId: this.projectId,
        staffId: this.staffId,
      },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        console.log(data.data);
        console.log(data);
        let actorIds = [];
        for (let actor of data.data) {
          actorIds.push(actor.id);
        }
        let existingactor = [];

        for (let actorObject of this.staff.actors) {
          existingactor.push(actorObject);
        }
        this.http
          .patch(
            `api/clients/${this.clientId}/projects/${this.projectId}/staff/${this.staff.id}/`,
            {
              //  : data.data. ,
              actors: [...actorIds, ...existingactor],
            }
          )
          .then(() => {
            this.getStaffDetails();
          });
      }
    });

    return await modal.present();
  }

  async openActionSheet(actor: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        // {
        //   text: 'Edit',
        //   handler: () => {
        //     this.onEditStaff(actor);
        //   },
        // },
        {
          text: 'Remove',
          handler: () => {
            console.log(
              this.staff.actors.filter(
                (actorinlist: any) => actorinlist.id != actor.id
              )
            );

            let actorObjectList = this.staff.actors.filter(
              (actorinlist: any) => actorinlist != actor.id
            );
            // let actorIdList = [];
            // for (let actorObject of actorObjectList) {
            //   actorIdList.push(actorObject.id);
            // }
            this.http
              .patch(
                `api/clients/${this.clientId}/projects/${this.projectId}/staff/${this.staffId}/`,
                {
                  actors: actorObjectList,
                }
              )
              .then(() => {
                this.getStaffDetails();
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

  // async onEditActor(staff: any) {
  //   console.log(staff);
  //   const modal = await this.modalController.create({
  //     component: AddEditStaffModalComponent,
  //     componentProps: {
  //       defaultRole: staff.name,
  //       clientId: this.clientId,
  //       projectId: this.projectId,
  //     },
  //   });

  //   modal.onDidDismiss().then((data: any) => {
  //     if (data.data) {
  //       this.http
  //         .patch(
  //           `api/clients/${this.clientId}/projects/${this.projectId}/staff/${staff.id}/`,
  //           {
  //             //  : data.data. ,
  //             name: data.data.role,
  //           }
  //         )
  //         .then(() => {
  //           this.getStaffDetails();
  //         });
  //     }
  //   });

  //   return await modal.present();
  // }
}
