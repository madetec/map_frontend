import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  { path: 'main', loadChildren: './main/main-user.module#MainUserPageModule' },
  { path: 'profile', loadChildren: './profile/profile-user.module#ProfileUserPageModule' },
  { path: 'order', loadChildren: './order/history/order-user-history.module#OrderUserHistoryPageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
