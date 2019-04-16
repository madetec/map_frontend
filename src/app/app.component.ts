import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {FcmService} from './@core/services/fcm.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Главная',
      url: '/main-user',
      icon: 'pin'
    },
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
      private fcm: FcmService,
      private router: Router
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.fcm.getToken();
        if (localStorage.getItem('currentUser')) {
            this.router.navigateByUrl('/main-user');
        } else {
            this.router.navigateByUrl('/login');
        }
    });
  }
}
