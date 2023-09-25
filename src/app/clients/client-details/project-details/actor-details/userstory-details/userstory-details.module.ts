import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserstoryDetailsPageRoutingModule } from './userstory-details-routing.module';

import { UserstoryDetailsPage } from './userstory-details.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserstoryDetailsPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [UserstoryDetailsPage],
})
export class UserstoryDetailsPageModule {}
