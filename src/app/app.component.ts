import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {AuthenticationService} from './@core/services/authentication.service';
import {FCM} from '@ionic-native/fcm/ngx';
import {NetworkService} from './@core/services/network.service';
import { OrderService } from './@core/services/order.service';

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
        private orderService: OrderService
    ) {
        this.initializeApp();
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
                                alert(data);
                                this.onNotification(data.data);
                            } else {
                                this.onNotification(data.data);
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
        if ( notif.type === 'completed_order' ) {
            alert(notif);
        } else if ( notif.type === 'cancel_order' ) {
            alert(notif);
        } else if ( notif.type === 'take_order' ) {
            alert(notif);
        } else if ( notif.type === 'driver_is_waiting' ) {
            alert(notif);
        } else if ( notif.type === 'started_order' ) {
            alert(notif);
        } else if ( notif.type === 'new_order' ) {
            this.orderService.newDriverOrder(notif.order_id);
        }
    }

    configureStatusBar() {
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString('#f6f6f6');
    }

    logout() {
        this.authenticationService.logout();
    }
}
