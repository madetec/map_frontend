import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {ProfileUserPage} from './profile-user.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileUserPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileUserPage]
})
export class ProfileUserPageModule {}
