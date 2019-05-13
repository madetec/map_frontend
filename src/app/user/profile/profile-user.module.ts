import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {ProfileUserPage} from './profile-user.page';
import {NgxMaskModule} from 'ngx-mask';

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
    RouterModule.forChild(routes),
    NgxMaskModule.forRoot()
  ],
  declarations: [ProfileUserPage]
})
export class ProfileUserPageModule {}
