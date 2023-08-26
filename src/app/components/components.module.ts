import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AddEditClientModalComponent } from './add-edit-client-modal/add-edit-client-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddEditProjectModalComponent } from './add-edit-project-modal/add-edit-project-modal.component';
import { AddEditActorModalComponent } from './add-edit-actor-modal/add-edit-actor-modal.component';
import { AddEditStaffModalComponent } from './add-edit-staff-modal/add-edit-staff-modal.component';
import { AssociateStaffModalComponent } from './associate-staff-modal/associate-staff-modal.component';
import { AssociateActorModalComponent } from './associate-actor-modal/associate-actor-modal.component';

@NgModule({
  declarations: [
    AddEditClientModalComponent,
    AddEditProjectModalComponent,
    AddEditActorModalComponent,
    AddEditStaffModalComponent,
    AssociateStaffModalComponent,
    AssociateActorModalComponent,
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class ComponentsModule {}
