import {Component} from '@angular/core';

import {Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {AuthenticationService} from './@core/services/authentication.service';
import {FCM} from '@ionic-native/fcm/ngx';
import {NetworkService} from './@core/services/network.service';
import {OrderService} from './@core/services/order.service';
import {GeolocationService} from './@core/services/geolocation.service';

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

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router: Router,
        private authenticationService: AuthenticationService,
        private fcm: FCM,
        private network: NetworkService,
        private geoService: GeolocationService,
        private orderService: OrderService,
        public toastController: ToastController
    ) {
        this.initializeApp();
    }

    async presentToastWithOptions(header: string, message: string) {
        const toast = await this.toastController.create({
          header: header,
            message: message
        });
        toast.present();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.configureStatusBar();
            this.splashScreen.hide();
            this.network.onNetworkChange().subscribe();
            this.authenticationService.authenticationState.subscribe(state => {
                if (state) {
                    this.appPages = this.authenticationService.initMenuByRole();
                    this.authenticationService.getCurrentUser().subscribe(user => {
                        if (user) {
                            this.currentUser.name = `${user.profile.last_name} ${user.profile.name}`;
                            this.currentUser.phone = user.profile.main_phone;
                            this.currentUser.role = user.roleName;
                        }
                        this.fcm.onNotification().subscribe(data => {
                            if (data.wasTapped) {
                                this.onNotification(data);
                            } else {
                                this.onNotification(data);
                            }
                        });
                        this.fcm.getToken().then(token => {
                            if (token) {
                                this.authenticationService.setFirebaseToken(token);
                            }
                        });
                    });
                    this.authenticationService.routingByRole();
                } else {
                    this.router.navigate(['login']);
                }
            });
        });
    }

    onNotification(notif: any) {
        if (notif.type === 'new_order') {
            this.orderService.newDriverOrder(notif.id);
        } else if (notif.type === 'cancel_order') {
            if (notif.who === 'driver') {
                this.orderService.userOrderNotif(notif);
            } else if (notif.who === 'user') {
                this.orderService.newDriverOrder(notif.id);
            }
        } else {
            this.orderService.userOrderNotif(notif);
        }
        // if ( notif.type === 'completed_order' ) {
        //     // Поездка завершена
        // } else if ( notif.type === 'cancel_order' ) {
        //     // Поездка отменена
        //     this.orderService.userOrderNotif(notif);
        // } else if ( notif.type === 'take_order' ) {
        //     // водитель в пути to user
        //     this.orderService.userOrderNotif(notif);
        // } else if ( notif.type === 'driver_is_waiting' ) {
        //     // водитель вас ждет
        //     this.orderService.userOrderNotif(notif);
        // } else if ( notif.type === 'started_order' ) {
        //     // Начало поездки
        //     this.orderService.userOrderNotif(notif);
        // }
    }

    configureStatusBar() {
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString('#f6f6f6');
    }

    logout() {
        this.authenticationService.logout();
    }
}
