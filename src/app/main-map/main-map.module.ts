import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthGuard } from '../@core/guards/auth.guard';
import { Role } from '../@core/models/role';
import { MainMapPage } from './main-map.page';

const routes: Routes = [
  {
    path: '',
    component: MainMapPage,
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
  declarations: [MainMapPage]
})
export class MainMapPageModule {}
