import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthGuard } from '../@core/guards/auth.guard';
import { Role } from '../@core/models/role';
import { MainUserPage } from './main-user.page';

const routes: Routes = [
  {
    path: '',
    component: MainUserPage,
    canActivate: [AuthGuard],
    data: { roles: [Role.User] }
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainUserPage]
})
export class MainUserPageModule {}
