import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';

import {JwtInterceptor} from './@core/helpers/jwt.interceptor';
import {ErrorInterceptor} from './@core/helpers/error.interceptor';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {Device} from '@ionic-native/device/ngx';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {Firebase} from '@ionic-native/firebase/ngx';
import {FcmService} from './@core/services/fcm.service';

import {Network} from '@ionic-native/network/ngx';

import localeRu from '@angular/common/locales/ru';
import {registerLocaleData} from '@angular/common';
import {AuthService} from './@core/services/auth.service';
import {ModalPage} from './modal/modal.page';
import {ModalPageModule} from './modal/modal.module';

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
  entryComponents: [ModalPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
      HttpClientModule,
      AngularFireModule.initializeApp(config),
      AngularFirestoreModule,
      ModalPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
      Firebase,
      Device,
      FcmService,
      Network,
      AuthService,
      {provide: LOCALE_ID, useValue: 'ru'},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
