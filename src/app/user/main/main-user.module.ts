import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MainUserPage } from './main-user.page';
import {NgxMaskModule} from 'ngx-mask';

const routes: Routes = [
  {
    path: '',
    component: MainUserPage
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
  declarations: [MainUserPage]
})
export class MainUserPageModule {}
