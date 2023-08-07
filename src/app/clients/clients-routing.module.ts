import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientsPage } from './clients.page';

const routes: Routes = [
  {
    path: '',
    component: ClientsPage,
  },
  {
    path: 'detail',
    loadChildren: () =>
      import('./client-details/client-details.module').then(
        (m) => m.ClientDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsPageRoutingModule {}
