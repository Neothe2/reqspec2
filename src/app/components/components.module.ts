import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AddEditClientModalComponent } from './add-edit-client-modal/add-edit-client-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddEditProjectModalComponent } from './add-edit-project-modal/add-edit-project-modal.component';
import { AddEditActorModalComponent } from './add-edit-actor-modal/add-edit-actor-modal.component';

@NgModule({
  declarations: [
    AddEditClientModalComponent,
    AddEditProjectModalComponent,
    AddEditActorModalComponent,
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class ComponentsModule {}
