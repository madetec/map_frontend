import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {ProfileDriverPage} from './profile-driver.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileDriverPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileDriverPage]
})
export class ProfileDriverPageModule {}
