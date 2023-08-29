import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UseCaseDetailsPage } from './use-case-details.page';

const routes: Routes = [
  {
    path: '',
    component: UseCaseDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UseCaseDetailsPageRoutingModule {}
