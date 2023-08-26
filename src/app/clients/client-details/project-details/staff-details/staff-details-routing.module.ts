import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StaffDetailsPage } from './staff-details.page';

const routes: Routes = [
  {
    path: ':staffId',
    component: StaffDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffDetailsPageRoutingModule {}
