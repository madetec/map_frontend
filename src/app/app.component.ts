import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {AuthService} from './@core/services/auth.service';
import {AuthenticationService} from './@core/services/authentication.service';

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
        private authService: AuthService,
        private authenticationService: AuthenticationService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.configureStatusBar();
            this.splashScreen.hide();
            this.authenticationService.authenticationState.subscribe(state => {
                if (state) {
                    this.appPages = this.authenticationService.initMenuByRole();
                    this.authenticationService.getCurrentUser().subscribe(user => {
                        if (user) {
                            this.currentUser.name = `${user.profile.last_name} ${user.profile.name}`;
                            this.currentUser.phone = user.profile.main_phone;
                            this.currentUser.role = user.roleName;
                        }
                    });
                    this.authenticationService.routingByRole();
                } else {
                    this.router.navigate(['login']);
                }
            });
        });
    }

    configureStatusBar() {
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString('#f6f6f6');
    }

    logout() {
        this.authenticationService.logout();
    }
}
