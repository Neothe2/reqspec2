import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientDetailsPage } from './client-details.page';

const routes: Routes = [
  {
    path: ':id/project-details',
    loadChildren: () =>
      import('./project-details/project-details.module').then(
        (m) => m.ProjectDetailsPageModule
      ),
  },
  {
    path: ':id',
    component: ClientDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientDetailsPageRoutingModule {}
