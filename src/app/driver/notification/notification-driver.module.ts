import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationDriverPage } from './notification-driver.page';
import {NgxMaskModule} from 'ngx-mask';

const routes: Routes = [
  {
    path: '',
    component: NotificationDriverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxMaskModule.forRoot()
  ],
  declarations: [NotificationDriverPage]
})
export class NotificationDriverPageModule {}
