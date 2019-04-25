import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoadingController, MenuController, ModalController, Platform} from '@ionic/angular';
import * as L from 'leaflet/dist/leaflet.js';
import {User} from '../@core/models/user';
import {AuthService} from '../@core/services/auth.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Markers} from '../@core/models/markers';
import {ToModalPage} from '../modals/order/location/to/to-modal.page';
import {YaHelper} from '../@core/helpers/yandex-geocoder.helper';
import {ActiveModalPage} from '../modals/order/active/active-modal.page';
import {OrderService} from '../@core/services/order.service';


@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.page.html',
    styleUrls: ['./main-user.page.scss']
})
export class MainUserPage implements OnInit {
    @ViewChild('map') mapContainer: ElementRef;
    markers: Markers = new Markers();
    user: User;
    map: L;
    toModal: any;
    loader: any;

    location = {
        lat: 0,
        lng: 0,
        from: {
            lat: 0,
            lng: 0,
            address: ''
        },
        to: {
            lat: 0,
            lng: 0,
            address: ''
        }
    };

    constructor(
        private geolocation: Geolocation,
        private menuCtrl: MenuController,
        private platform: Platform,
        private service: AuthService,
        public modalController: ModalController,
        public loadingController: LoadingController,
        public orderService: OrderService,
        private yaHelper: YaHelper
    ) {
        this.user = this.service.getCurrentUser;
        this.location.to.address = 'Куда?';
        this.location.lat = 41.310387;
        this.location.lng = 69.274695;
        this.location.from.lat = 41.310387;
        this.location.from.lng = 69.274695;
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
        this.loadMap();
        this.updateUserLocation();
        setInterval(this.updateUserLocation, 1000);
        this.updateAddress(this.location.from.lng, this.location.from.lat);
    }
    async toModalPresent() {
        this.toModal = await this.modalController.create({
            component: ToModalPage,
            componentProps: {value: 123}
        });
        await this.toModal.present();
        const {data} = await this.toModal.onDidDismiss();
        if (data.result !== 'cancel') {
            this.location.to.address = data.result.GeoObject.name;
            let latLng = data.result.GeoObject.Point.pos;
            if (!this.markers.pinB) {
                this.markers.setPinBLatLng(latLng);
                this.markers.pinB.addTo(this.map);
            } else {
                this.markers.pinB.setLatLng({lat: latLng[0], lng: latLng[1]});
            }

            const bounds = new L.LatLngBounds([
                [this.location.from.lat, this.location.from.lng],
                [latLng[0], latLng[1]],
            ]);
            this.map.fitBounds(bounds);
            const zoom = this.map.getBoundsZoom(bounds);
            this.map.setZoom(zoom - 1);

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
        if (!this.markers.pinB) {
            this.updateAddress(this.location.lng, this.location.lat);
        }
        setTimeout(function () {
            (document).getElementById('panTo')
                .classList.add('cbutton--click');
        }, 150);
        setTimeout(function () {
            (document).getElementById('panTo')
                .classList.remove('cbutton--click');
        }, 700);
    }

    setUserLocation(lat: number, lng: number) {
        this.location.lat = lat;
        this.location.lng = lng;
        this.markers.pinUser.setLatLng({
            lat: this.location.lat,
            lng: this.location.lng
        });
        this.markers.pinA.setLatLng({
            lat: this.location.lat,
            lng: this.location.lng
        });
        this.map.panTo([
            this.location.lat,
            this.location.lng
        ]);
    }

    updateUserLocation() {
        try {
            this.geolocation.getCurrentPosition()
                .then((position) => this.setUserLocation(position.coords.latitude, position.coords.longitude));
        } catch (e) {
        }
    }

    updateAddress(lng, lat) {
        const data = this.service.getTextCurrentLocation([lng, lat]);
        data.subscribe(res => {
            if (res) {
                this.location.from = this.yaHelper.getAddress(res);
            }
        });
    }

    onClearTo() {
        this.map.removeLayer(this.markers.pinB);
        this.markers.pinB = null;
        this.location.to.address = 'Куда?';
    }

    clearAddress() {
        this.location.from.address = '';
    }

    onSubmit() {
        this.presentLoading('Оформление заказа...', 0, 'crescent');
        this.orderService.createOrder(
            this.location.from.lat,
            this.location.from.lng,
            this.location.from.address,
            this.location.to.lat,
            this.location.to.lng,
            this.location.to.address
        ).subscribe(data => {
            this.orderActiveModalPresent(data);
            this.loader.dismiss();
        }, error => {
            this.loader.dismiss();
            this.presentLoading(error, 3000, 'dots');
        });
    }


    async presentLoading(text, duration = 0, spinner = null) {
        this.loader = await this.loadingController.create({
            spinner: spinner,
            duration: duration,
            message: text,
            translucent: true
        });
        return await this.loader.present();
    }

    ngOnInit() {
        this.orderService.getActiveOrder().subscribe( res => {
            if(res) {
                this.orderActiveModalPresent(res);
            }
        });
    }

    async orderActiveModalPresent(res: any) {
        this.toModal = await this.modalController.create({
            component: ActiveModalPage,
            componentProps: { activeOrder: res }
        });
        await this.toModal.present();
        const {data} = await this.toModal.onDidDismiss();
        if (data.result !== 'cancel') {
            if (data.result.orderId) {
                this.orderService.orderCanceled(data.result.orderId).subscribe(data => {
                    if (data) {
                        alert('Заказ успешно отменен!');
                    }
                });
            }
        } else {
            console.log('Cancelled order!' + data);
        }
    }
}
