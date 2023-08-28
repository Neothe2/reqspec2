import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserstoryDetailsPageRoutingModule } from './userstory-details-routing.module';

import { UserstoryDetailsPage } from './userstory-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserstoryDetailsPageRoutingModule
  ],
  declarations: [UserstoryDetailsPage]
})
export class UserstoryDetailsPageModule {}
