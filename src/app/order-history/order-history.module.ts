import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthGuard } from '../@core/guards/auth.guard';
import { Role } from '../@core/models/role';
import { OrderHistoryPage } from './order-history.page';

const routes: Routes = [
  {
    path: '',
    component: OrderHistoryPage,
    canActivate: [AuthGuard],
    data: { roles: [Role.User] }
  }
];


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderHistoryPage]
})
export class OrderHistoryPageModule {}
