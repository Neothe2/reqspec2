import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AddEditClientModalComponent } from './add-edit-client-modal/add-edit-client-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditProjectModalComponent } from './add-edit-project-modal/add-edit-project-modal.component';
import { AddEditActorModalComponent } from './add-edit-actor-modal/add-edit-actor-modal.component';
import { AddEditStaffModalComponent } from './add-edit-staff-modal/add-edit-staff-modal.component';
import { AssociateStaffModalComponent } from './associate-staff-modal/associate-staff-modal.component';
import { AssociateActorModalComponent } from './associate-actor-modal/associate-actor-modal.component';
import { AddEditUserstoryFromProjectComponent } from './add-edit-userstory-from-project/add-edit-userstory-from-project.component';
import { AssociateUseCaseModalComponent } from './associate-use-case-modal/associate-use-case-modal.component';
import { AddEditUseCaseModalComponent } from './add-edit-use-case-modal/add-edit-use-case-modal.component';
import { AssociateUserStoryModalComponent } from './associate-user-story-modal/associate-user-story-modal.component';
import { AddEditUseCaseSpecificationSectionModalComponent } from './add-edit-use-case-specification-section-modal/add-edit-use-case-specification-section-modal.component';
import { ShortcutButtonDirective } from './shortcut-button.directive';

@NgModule({
  declarations: [
    AddEditClientModalComponent,
    AddEditProjectModalComponent,
    AddEditActorModalComponent,
    AddEditStaffModalComponent,
    AssociateStaffModalComponent,
    AssociateActorModalComponent,
    AddEditUserstoryFromProjectComponent,
    AssociateUseCaseModalComponent,
    AddEditUseCaseModalComponent,
    AssociateUseCaseModalComponent,
    AssociateUserStoryModalComponent,
    AddEditUseCaseSpecificationSectionModalComponent,
    ShortcutButtonDirective,
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
  exports: [ShortcutButtonDirective],
})
export class ComponentsModule {}
