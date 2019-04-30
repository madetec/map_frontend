import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {FcmService} from './@core/services/fcm.service';
import {Router} from '@angular/router';
import {AuthService} from './@core/services/auth.service';
import {ConnectionStatus, NetworkService} from './@core/services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
    public currentUser = {
        name: null,
        phone: null,
        role: null
    };
    public appPages: any;
    public onlineOffline: boolean = navigator.onLine;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private fcm: FcmService,
        private router: Router,
        private authService: AuthService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.initPages();
            this.statusBar.styleDefault();
            this.statusBar.backgroundColorByHexString('#f6f6f6');
            this.splashScreen.hide();
            this.fcm.getToken();
        });
    }

    initPages() {
        this.appPages = [
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
            }
        ];
    }

    logout() {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }
}
