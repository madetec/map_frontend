import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthGuard } from '../@core/guards/auth.guard';
import { Role } from '../@core/models/role';
import { MainDriverPage } from './main-driver.page';

const routes: Routes = [
  {
    path: '',
    component: MainDriverPage,
    canActivate: [AuthGuard],
    data: { roles: [Role.Driver] }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainDriverPage]
})
export class MainDriverPageModule {}
