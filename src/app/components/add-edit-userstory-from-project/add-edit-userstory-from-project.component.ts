import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  ModalController,
  NavParams,
} from '@ionic/angular';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-add-edit-userstory-from-project',
  templateUrl: './add-edit-userstory-from-project.component.html',
  styleUrls: ['./add-edit-userstory-from-project.component.scss'],
})
export class AddEditUserstoryFromProjectComponent implements OnInit {
  // @Input() staffId!: string | null;
  @Input() clientId!: string | null;
  @Input() projectId!: string | null;
  form!: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private fb: FormBuilder,
    private navParams: NavParams
  ) {
    // this.actorId = this.route.snapshot.paramMap.get('actorId');
    // this.clientId = this.route.snapshot.paramMap.get('id');
    // this.projectId = this.route.snapshot.paramMap.get('projectId');
    const defaultStory = this.navParams.get('defaultStory');
    this.defaultActorId = this.navParams.get('defaultActorId');

    this.form = fb.group({
      story: [defaultStory || '', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.clientId && this.projectId) {
      this.getData();
    }
    if (!this.defaultActorId) {
      this.defaultActorId = null;
    }
  }

  getData() {
    this.http
      .get(`api/clients/${this.clientId}/projects/${this.projectId}/actors/`)
      .then((actors: any) => {
        // this.http
        //   .get(
        //     `api/clients/${this.clientId}/projects/${this.projectId}/staff/${this.staffId}/`
        //   )
        //   .then((staff: any) => {
        //     let actorIds = staff.actors;

        //     for (let actorId of actorIds) {
        //       this.actorList = this.actorList.filter(
        //         (actorObject) => actorObject.id != actorId
        //       );
        //     }
        //   });
        this.actorList = actors.results;
      });
  }

  actorList: any[] = []; // This should be populated with your staff data
  checkedItems: any[] = [];
  selectedActor: any = {};
  @Input() defaultStory: string = '';
  @Input() defaultActorId: number | null = 0;

  // Sample data (you should fetch the actual data)
  // staffList = [
  //   { id: 1, name: 'John Doe' },
  //   { id: 2, name: 'Jane Smith' },
  //   // ... other staff members
  // ];

  updateCheckedItems(staffMember: any, event: any) {
    this.selectedActor = staffMember;
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  submit() {
    let res = {
      story: this.form.value['story'],
      actor: this.selectedActor.id,
    };
    this.modalController.dismiss(res);
  }
}
