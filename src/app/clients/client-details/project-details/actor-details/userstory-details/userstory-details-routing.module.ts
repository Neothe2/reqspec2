import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserstoryDetailsPage } from './userstory-details.page';

const routes: Routes = [
  {
    path: ':userStoryId',
    component: UserstoryDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserstoryDetailsPageRoutingModule {}
