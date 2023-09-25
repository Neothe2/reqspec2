import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActorDetailsPageRoutingModule } from './actor-details-routing.module';

import { ActorDetailsPage } from './actor-details.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActorDetailsPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [ActorDetailsPage],
})
export class ActorDetailsPageModule {}
