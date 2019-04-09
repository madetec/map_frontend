
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class FcmService {

    constructor(private firebase: Firebase,
                private afs: AngularFirestore,
                private platform: Platform) {}

    async getToken() {
        let token;

        if (this.platform.is('android')) {
            token = await this.firebase.getToken();
        }

        if (this.platform.is('ios')) {
            token = await this.firebase.getToken();
            await this.firebase.grantPermission();
        }
        localStorage.setItem('firebase_token', JSON.stringify(token));
    }
    onNotifications() {
        return this.firebase.onNotificationOpen();
    }
}