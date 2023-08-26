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
  {
    path: ':projectId/staff-details',
    loadChildren: () =>
      import('./staff-details/staff-details.module').then(
        (m) => m.StaffDetailsPageModule
      ),
  },
  {
    path: ':projectId/actors',
    loadChildren: () =>
      import('./actors/actors.module').then((m) => m.ActorsPageModule),
  },
  {
    path: ':projectId/staff',
    loadChildren: () =>
      import('./staff/staff.module').then((m) => m.StaffPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectDetailsPageRoutingModule {}
