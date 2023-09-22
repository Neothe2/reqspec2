import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientDetailsPageRoutingModule } from './client-details-routing.module';

import { ClientDetailsPage } from './client-details.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientDetailsPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [ClientDetailsPage],
})
export class ClientDetailsPageModule {}
