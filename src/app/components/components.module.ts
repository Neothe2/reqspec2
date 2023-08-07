import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AddEditClientModalComponent } from './add-edit-client-modal/add-edit-client-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddEditClientModalComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class ComponentsModule {}
