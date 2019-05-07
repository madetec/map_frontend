import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {OrderHistoryPage} from './order-history.page';

const routes: Routes = [
  {
    path: '',
    component: OrderHistoryPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
    declarations: [OrderHistoryPage],
})
export class OrderHistoryPageModule {}
