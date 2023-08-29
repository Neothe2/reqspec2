import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AssociateUserStoryModalComponent } from 'src/app/components/associate-user-story-modal/associate-user-story-modal.component';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-use-case-details',
  templateUrl: './use-case-details.page.html',
  styleUrls: ['./use-case-details.page.scss'],
})
export class UseCaseDetailsPage implements OnInit {
  useCase: any;

  userStories: any[] = [];

  clientId: string | null = '';
  projectId: string | null = '';
  actorId: string | null = '';
  useCaseId: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.actorId = this.route.snapshot.paramMap.get('actorId');
    this.clientId = this.route.snapshot.paramMap.get('id');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.useCaseId = this.route.snapshot.paramMap.get('useCaseId');
    console.log(this.actorId);
    console.log(this.clientId);
    console.log(this.projectId);
    if (this.actorId && this.clientId && this.projectId && this.useCaseId) {
      this.getUseCaseDetails();
    }
  }

  getUseCaseDetails() {
    this.http
      .get(
        `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actorId}/use_cases/${this.useCaseId}`
      )
      .then((data: any) => {
        console.log('something');
        console.log(data);
        this.useCase = data;
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
      component: AssociateUserStoryModalComponent,
      componentProps: {
        clientId: this.clientId,
        projectId: this.projectId,
        actorId: this.actorId,
        useCaseId: this.useCaseId,
      },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        console.log(data.data);
        console.log(data);
        let userStoryIds = [];
        for (let userStory of data.data) {
          userStoryIds.push(userStory.id);
        }
        let existingUserStories = [];

        for (let userStory of this.useCase.user_stories) {
          existingUserStories.push(userStory.id);
        }
        this.http
          .patch(
            `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actorId}/use_cases/${this.useCaseId}/`,
            {
              //  : data.data. ,
              user_stories: [...userStoryIds, ...existingUserStories],
            }
          )
          .then(() => {
            this.getUseCaseDetails();
          });
      }
    });

    return await modal.present();
  }

  async openActionSheet(userStory: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Remove',
          handler: () => {
            console.log(
              this.useCase.user_stories.filter(
                (userStoryInList: any) => userStoryInList.id != userStory.id
              )
            );

            let userStoryObjectList = this.useCase.user_stories.filter(
              (userStoryinlist: any) => userStoryinlist.id != userStory.id
            );
            let userStoryIdList = [];
            for (let userStoryObject of userStoryObjectList) {
              userStoryIdList.push(userStoryObject.id);
            }
            this.http
              .patch(
                `api/clients/${this.clientId}/projects/${this.projectId}/actors/${this.actorId}/use_cases/${this.useCaseId}/`,
                {
                  user_stories: userStoryIdList,
                }
              )
              .then(() => {
                this.getUseCaseDetails();
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
}
