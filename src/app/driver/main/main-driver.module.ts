import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {MainDriverPage} from './main-driver.page';
import {NgxMaskModule} from 'ngx-mask';

const routes: Routes = [
  {
    path: '',
    component: MainDriverPage
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
  declarations: [MainDriverPage]
})
export class MainDriverPageModule {}
