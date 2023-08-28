import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActorDetailsPage } from './actor-details.page';

const routes: Routes = [
  {
    path: ':actorId',
    component: ActorDetailsPage,
  },
  {
    path: ':actorId/userstory-details',
    loadChildren: () =>
      import('./userstory-details/userstory-details.module').then(
        (m) => m.UserstoryDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActorDetailsPageRoutingModule {}
