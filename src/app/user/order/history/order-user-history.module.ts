import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {OrderUserHistoryPage} from './order-user-history.page';

const routes: Routes = [
  {
    path: '',
    component: OrderUserHistoryPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
    declarations: [OrderUserHistoryPage],
})
export class OrderUserHistoryPageModule {}
