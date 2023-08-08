import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectDetailsPage } from './project-details.page';

const routes: Routes = [
  {
    path: ':projectId',
    component: ProjectDetailsPage,
  },
  {
    path: ':projectId/actor-details',
    loadChildren: () =>
      import('./actor-details/actor-details.module').then(
        (m) => m.ActorDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectDetailsPageRoutingModule {}
