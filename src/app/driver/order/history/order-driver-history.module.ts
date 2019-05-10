import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {OrderDriverHistoryPage} from './order-driver-history.page';

const routes: Routes = [
  {
    path: '',
    component: OrderDriverHistoryPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
    declarations: [OrderDriverHistoryPage],
})
export class OrderDriverHistoryPageModule {}
