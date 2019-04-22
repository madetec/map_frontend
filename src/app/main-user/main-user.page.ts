import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoadingController, MenuController, ModalController, Platform} from '@ionic/angular';
import * as L from 'leaflet/dist/leaflet.js';
import {User} from '../@core/models/user';
import {AuthService} from '../@core/services/auth.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {ModalPage} from '../modal/modal.page';
import {Markers} from '../@core/models/markers';
import {OrderRepositoryService} from '../@core/repositories/order/order-repository.service';

export interface Location {
    lat: number;
    lng: number;
    to: {
        lat: number,
        lng: number
    };
}

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.page.html',
    styleUrls: ['./main-user.page.scss']
})
export class MainUserPage implements OnInit {
    @ViewChild('map') mapContainer: ElementRef;
    markers: Markers = new Markers();
    user: User;
    currentAddress: string;
    map: L;
    location: Location;
    pin_user_marker: any;
    toModal: any;
    public to = 'Куда?';
    loader: any;
    constructor(
        private geolocation: Geolocation,
        private menuCtrl: MenuController,
        private platform: Platform,
        private service: AuthService,
        public modalController: ModalController,
        public loadingController: LoadingController,
        public order: OrderRepositoryService
    ) {
        this.user = this.service.getCurrentUser;
        this.location = {
            lat: 41.310387,
            lng: 69.274695,
            to: {
                lat: 0,
                lng: 0,
            }
        };
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
        this.updateLocation();
        this.updateAddress(this.location.lng, this.location.lat);
        setInterval(this.updateLocation, 500);
        this.loadMap();
    }

    async toModalPresent() {
        this.toModal = await this.modalController.create({
            component: ModalPage,
            componentProps: {value: 123}
        });
        await this.toModal.present();

        const {data} = await this.toModal.onDidDismiss();
        if (data.result !== 'cancel') {
            this.to = data.result.GeoObject.name;
            let latLng = data.result.GeoObject.Point.pos;
            if (!this.markers.pinB) {
                this.markers.setPinBLatLng(latLng);
                this.markers.pinB.addTo(this.map);
            } else {
                this.markers.pinB.setLatLng({lat: latLng[0], lng: latLng[1]});
            }
            this.map.fitBounds([
                [this.location.lat, this.location.lng],
                [latLng[0], latLng[1]],
            ]);

            this.location.to.lat = latLng[0];
            this.location.to.lng = latLng[1];
        }

    }

    onModal() {
        this.toModalPresent();
    }

    loadMap() {
        this.map = L.map('map', {
            center: [
                this.location.lat,
                this.location.lng
            ],
            zoom: 15,
            zoomControl: false
        });
        L.tileLayer('https://map.uztelecom.uz/hot/{z}/{x}/{y}.png', {
            attributions: 'https://telecom-car.uz',
            maxZoom: 18
        }).addTo(this.map);

        this.markers.setPinALatLng([this.location.lat, this.location.lng]);
        this.markers.pinA.addTo(this.map);

        this.markers.setPinUserLatLng([this.location.lat, this.location.lng]);
        this.markers.pinUser.addTo(this.map);

        this.map.on('move', (e) => this.onMove(e, this.markers.pinA));
        this.map.on('moveend', (e) => this.onMoveEnd(e));
    }

    onMove(event, marker) {
        if (!this.markers.pinB) {
            const position = event.target.getCenter();
            marker.setLatLng(position);
            this.clearAddress();
        }
    }

    onMoveEnd(event) {
        if (!this.markers.pinB) {
            const position = event.target.getCenter();
            this.updateAddress(position.lng, position.lat);
        }
    }

    onPanTo() {
        this.map.panTo([
            this.location.lat,
            this.location.lng
        ]);
        this.updateAddress(this.location.lng, this.location.lat);
        setTimeout(function () {
            (document).getElementById('panTo')
                .classList.add('cbutton--click');
        }, 150);
        setTimeout(function () {
            (document).getElementById('panTo')
                .classList.remove('cbutton--click');
        }, 700);
    }
    updateLocation() {
        try {
            this.geolocation.getCurrentPosition()
                .then((position) => this.setLocation(position));
        } catch (e) {}
    }

    setLocation(position) {
        this.location.lat = position.coords.latitude;
        this.location.lng = position.coords.longitude;
        this.pin_user_marker.setLatLng([
            this.location.lat,
            this.location.lng
        ]);
        this.updateAddress(this.location.lng, this.location.lat);
    }

    updateAddress(lng, lat) {
        const data = this.service.getTextCurrentLocation([lng, lat]);
        data.subscribe(res => {
            if (res) {
                this.currentAddress = res.GeoObjectCollection
                    .featureMember[0]
                    .GeoObject
                    .name;
            }
        });
    }

    onClearTo() {
        this.map.removeLayer(this.markers.pinB);
        this.markers.pinB = null;
        this.to = 'Куда?';
    }

    clearAddress() {
        this.currentAddress = null;
    }

    onSubmit() {
        this.presentLoading();
        const newOrder = this.order.createOrder({
            from_lat: this.location.lat,
            from_lng: this.location.lng,
            from_address: this.currentAddress,
            to_lat: this.location.to.lat,
            to_lng: this.location.to.lng,
            to_address: this.to
        }).subscribe(data => {
            this.loader.dismiss();
        });
    }

    async presentLoading() {
        this.loader = await this.loadingController.create({
            spinner: 'crescent',
            duration: 0,
            message: 'Оформление заказа...',
            translucent: true
        });
        return await this.loader.present();
    }

    ngOnInit() {
    }
}
