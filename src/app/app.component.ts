import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {FcmService} from './@core/services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Профиль',
      url: '/profile',
      icon: 'contact'
    },
    {
      title: 'История поездок',
      url: '/order-history',
      icon: 'filing'
    },
    {
      title: 'Оповещания',
      url: '/alert',
      icon: 'notifications-outline'
    },
    {
      title: 'Поддержка',
      url: '/help',
      icon: 'help-circle-outline'
    },
    {
      title: 'Выход',
      url: '/login',
      icon: 'log-out'
    }
  ];

  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private fcm: FcmService
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.fcm.getToken();
    });
  }
}
