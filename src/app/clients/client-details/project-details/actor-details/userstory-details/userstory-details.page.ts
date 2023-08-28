import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AddEditUserstoryFromProjectComponent } from 'src/app/components/add-edit-userstory-from-project/add-edit-userstory-from-project.component';
import { AssociateActorModalComponent } from 'src/app/components/associate-actor-modal/associate-actor-modal.component';
import { AssociateUseCaseModalComponent } from 'src/app/components/associate-use-case-modal/associate-use-case-modal.component';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-userstory-details',
  templateUrl: './userstory-details.page.html',
  styleUrls: ['./userstory-details.page.scss'],
})
export class UserstoryDetailsPage implements OnInit {
  userStory: any;
  useCases: any[] = [];

  clientId: string | null = '';
  projectId: string | null = '';
  actorId: string | null = '';
  userStoryId: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.userStoryId = this.route.snapshot.paramMap.get('userStoryId');
    this.actorId = this.route.snapshot.paramMap.get('actorId');
    this.clientId = this.route.snapshot.paramMap.get('id');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    console.log(this.clientId);
    console.log(this.projectId);
    if (this.actorId && this.clientId && this.projectId) {
      this.getStaffDetails();
    }
  }

  getStaffDetails() {
    this.http
      .get(
        `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actorId}/user_stories/${this.userStoryId}`
      )
      .then((data: any) => {
        console.log('something');
        console.log(data);
        this.userStory = data;
        let useCaseIds: any[] = data.use_cases;
        this.http
          .get(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/`
          )
          .then((actors: any) => {
            // useCaseIds = [];
            // for (let actor of actors.results) {
            //   for (let use_case of actor.use_cases) {
            //     useCaseIds.push(use_case.id);
            //   }
            // }
            this.http
              .get(
                `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actorId}/use_cases/`
              )
              .then((useCases: any) => {
                console.log();
                this.useCases = [];
                for (let useCaseId of useCaseIds) {
                  this.useCases = [
                    ...this.useCases,
                    ...(useCases.results as any[]).filter(
                      (useCase) => useCase.id == useCaseId
                    ),
                  ];
                }
              });
          });
      });
  }

  // async onAddUserStory() {
  //   const modal = await this.modalController.create({
  //     component: AddEditUserstoryFromProjectComponent,
  //     componentProps: {
  //       clientId: this.clientId,
  //       projectId: this.projectId,
  //       fromStaffDetail: true,
  //       associatedActors: this.actors,
  //     },
  //   });

  //   modal.onDidDismiss().then((data: any) => {
  //     if (data.data) {
  //       this.http
  //         .post(
  //           `api/clients/${this.clientId}/projects/${this.projectId}/actors/${data.data.actor}/user_stories/`,
  //           { ...data.data }
  //         )
  //         .then(() => {
  //           this.getStaffDetails();
  //         });
  //       console.log(data.data);
  //     }
  //   });

  //   return await modal.present();
  // }

  // navigateToDetailUserStory(userStory: any) {}

  // async onEditUserStory(userStory: any) {
  //   const modal = await this.modalController.create({
  //     component: AddEditUserstoryFromProjectComponent,
  //     componentProps: {
  //       defaultStory: userStory.story,
  //       defaultActorId: userStory.actor,
  //       clientId: this.clientId,
  //       projectId: this.projectId,
  //       fromStaffDetail: true,
  //       associatedActors: this.actors,
  //     },
  //   });

  //   modal.onDidDismiss().then((data: any) => {
  //     if (data.data) {
  //       this.http
  //         .patch(
  //           `api/clients/${this.clientId}/projects/${this.projectId}/actors/${userStory.actor}/user_stories/${userStory.id}/`,
  //           { ...data.data }
  //         )
  //         .then(() => {
  //           this.getStaffDetails();
  //         });
  //     }
  //   });

  //   return await modal.present();
  // }

  // async openActionSheetUserStory(userStory: any) {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Actions',
  //     buttons: [
  //       {
  //         text: 'Edit',
  //         handler: () => {
  //           this.onEditUserStory(userStory);
  //         },
  //       },
  //       {
  //         text: 'Delete',
  //         handler: () => {
  //           this.http
  //             .delete(
  //               `api/clients/${this.clientId}/projects/${this.projectId}/actors/${userStory.actor}/user_stories/${userStory.id}/`
  //             )
  //             .then(() => {
  //               this.getStaffDetails();
  //             });
  //         },
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //       },
  //     ],
  //   });
  //   await actionSheet.present();
  // }

  async onAddUseCase() {
    const modal = await this.modalController.create({
      component: AssociateUseCaseModalComponent,
      componentProps: {
        clientId: this.clientId,
        projectId: this.projectId,
        actorId: this.actorId,
        userStoryId: this.userStoryId,
      },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        console.log(data.data);
        console.log(data);
        let useCaseIds = [];
        for (let useCase of data.data) {
          useCaseIds.push(useCase.id);
        }
        let existingUseCases = [];

        for (let useCaseObject of this.userStory.use_cases) {
          existingUseCases.push(useCaseObject);
        }
        this.http
          .patch(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actorId}/user_stories/${this.userStoryId}/`,
            {
              //  : data.data. ,
              use_cases: [...useCaseIds, ...existingUseCases],
            }
          )
          .then(() => {
            this.getStaffDetails();
          });
      }
    });

    return await modal.present();
  }

  async openActionSheet(use_case: any) {
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
            // console.log(
            //   this.staff.actors.filter(
            //     (actorinlist: any) => actorinlist.id != actor.id
            //   )
            // );

            let useCaseObjectList = this.userStory.use_cases.filter(
              (useCaseinlist: any) => useCaseinlist != use_case.id
            );
            // let actorIdList = [];
            // for (let actorObject of actorObjectList) {
            //   actorIdList.push(actorObject.id);
            // }
            this.http
              .patch(
                `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actorId}/user_stories/${this.userStoryId}/`,
                {
                  use_cases: useCaseObjectList,
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
