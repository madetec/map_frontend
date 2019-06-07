import {Injectable} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Platform, ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class GeolocationService {
    public lat = 41.325306;
    public lng = 69.317139;
    public watchLocationUpdates: any;
    public loading: any;
    public isWatching: boolean;

    constructor(private geolocation: Geolocation, private plt: Platform, private toastCtrl: ToastController) {
        this.plt.ready().then(() => {
            this.getGeolocation();
        });
    }

    getGeolocation() {
        this.geolocation.getCurrentPosition().then((resp) => {
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            this.updateGeolocation('Местоположения определено!');
        }).catch((error) => {
            this.updateGeolocation('Ошибка определения местоположения!');
        });
    }

    async updateGeolocation(status) {
        const toast = this.toastCtrl.create({
            message: `${status}`,
            duration: 3000,
            position: 'bottom'
        });
        toast.then(toast => toast.present());
    }

    watchLocation() {
        this.isWatching = true;
        this.watchLocationUpdates = this.geolocation.watchPosition();
        this.watchLocationUpdates.subscribe((resp) => {
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
        });
    }

    stopLocationWatch() {
        this.isWatching = false;
        this.watchLocationUpdates.unsubscribe();
    }
}
