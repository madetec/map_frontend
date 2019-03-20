import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { MainMapPage } from './main-map.page';

const routes: Routes = [
  {
    path: '',
    component: MainMapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainMapPage],
  providers: [
    Geolocation    
  ]
})
export class MainMapPageModule {}
