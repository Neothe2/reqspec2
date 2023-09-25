import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StaffDetailsPageRoutingModule } from './staff-details-routing.module';

import { StaffDetailsPage } from './staff-details.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaffDetailsPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [StaffDetailsPage],
})
export class StaffDetailsPageModule {}
