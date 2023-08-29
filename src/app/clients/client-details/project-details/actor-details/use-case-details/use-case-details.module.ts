import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UseCaseDetailsPageRoutingModule } from './use-case-details-routing.module';

import { UseCaseDetailsPage } from './use-case-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UseCaseDetailsPageRoutingModule
  ],
  declarations: [UseCaseDetailsPage]
})
export class UseCaseDetailsPageModule {}
