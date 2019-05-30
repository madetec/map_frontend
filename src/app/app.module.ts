import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {BackgroundGeolocation} from '@ionic-native/background-geolocation/ngx';

import {JwtInterceptor} from './@core/helpers/jwt.interceptor';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {Device} from '@ionic-native/device/ngx';

import {Network} from '@ionic-native/network/ngx';

import localeRu from '@angular/common/locales/ru';
import {registerLocaleData} from '@angular/common';
import {ToModalModule} from './modals/order/location/to/to-modal.module';
import {ActiveModalModule} from './modals/order/active/active-modal.module';
import {WaitModalModule} from './modals/order/wait/wait-modal.module';
import {YaHelper} from './@core/helpers/yandex-geocoder.helper';
import {IonicStorageModule} from '@ionic/storage';
import {NgxMaskModule} from 'ngx-mask';
import {ErrorInterceptor} from './@core/helpers/error.interceptor';
import {FCM} from '@ionic-native/fcm/ngx';
import {NotificationService} from './@core/services/notification.service';
import {NetworkService} from './@core/services/network.service';

registerLocaleData(localeRu);

const config = {
    apiKey: 'AIzaSyCaCwfI9iDsX31Brcv28EwUPWZgcpQRQqM',
    authDomain: 'telecom-car24.firebaseapp.com',
    databaseURL: 'https://telecom-car24.firebaseio.com',
    projectId: 'telecom-car24',
    storageBucket: 'telecom-car24.appspot.com',
    messagingSenderId: '515812942516'
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ToModalModule,
    ActiveModalModule,
    WaitModalModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    BackgroundGeolocation,
    Device,
    Network,
    YaHelper,
    FCM,
    NotificationService,
    NetworkService,
    {provide: LOCALE_ID, useValue: 'ru'},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
