import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoadingController, MenuController, ModalController, Platform} from '@ionic/angular';
import * as L from 'leaflet/dist/leaflet.js';
import {User} from '../../@core/models/user';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Markers} from '../../@core/models/markers';
import {ToModalPage} from '../../modals/order/location/to/to-modal.page';
import {YaHelper} from '../../@core/helpers/yandex-geocoder.helper';
import {OrderService} from '../../@core/services/order.service';
import {AuthenticationService} from '../../@core/services/authentication.service';

@Component({
    selector: 'main-user',
    templateUrl: './main-user.page.html',
    styleUrls: ['./main-user.page.scss']
})
export class MainUserPage implements OnInit {
    ws;
    @ViewChild('map') mapContainer: ElementRef;
    markers: Markers = new Markers();
    user: User;
    map: L;
    toModal: any;
    loader: any;
    currentStatus;
    currentOrder;
    currentOrderMsg;

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
        public modalController: ModalController,
        public loadingController: LoadingController,
        public orderService: OrderService,
        private yaHelper: YaHelper,
        private authService: AuthenticationService
    ) {
        this.currentStatus = 0;
        this.location.to.address = 'Куда?';
        this.location.lat = 41.310387;
        this.location.lng = 69.274695;
        this.location.from.lat = 41.310387;
        this.location.from.lng = 69.274695;
        authService.getCurrentUser().subscribe(user => {
            if (user) {
                this.user = user;
            }
        });
        this.orderService.userOrderEmitter$.subscribe(data => {
            alert(JSON.stringify(data));
            if ( data.type === 'take_order' ) {
                this.currentStatus = 45;
            } else if ( data.type === 'driver_is_waiting' ) {
                this.currentStatus = 50;
            } else if ( data.type === 'started_order' ) {
                this.currentStatus = 55;
            } else if (data.type === 'completed_order') {
                this.presentLoading(this.currentOrderMsg.title, 2000, 'crescent');
                this.currentStatus = 0;
            }
            // this.currentOrderMsg.title = data.title;
            this.currentOrderMsg = data.body;
        });
        this.ws = new WebSocket( `wss://telecom-car.uz/ws?user_id=${this.user.profile.user_id}&lat=${this.location.lat}&lng=${this.location.lng}`);
    }

    ngOnInit(): void {
        try {
            this.orderService.getActiveOrder().subscribe(res => {
                if (res) {
                    if ( this.currentStatus === 25) {
                        this.presentLoading(res.status.name, 2000, 'crescent');
                        this.currentStatus = 0;
                        this.currentOrder = undefined;
                    } else {
                        this.currentStatus = res.status.code;
                        this.currentOrder = res;
                    }
                }
            });
        } catch (e) {
        }
        setInterval(this.updateUserLocation, 1000);
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
        this.loadMap();
        this.updateUserLocation();
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
            const latLng = data.result.GeoObject.Point.pos;
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
        }
    }

    onMoveEnd(event) {
        if (!this.markers.pinB) {
            const position = event.target.getCenter();
            this.clearAddress();
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
        this.ws.send(this.prepareWsMessage('coordinates', {'lat': lat, 'lng': lng}));
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
        const data = this.yaHelper.getTextCurrentLocation([lng, lat]);
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
        this.presentLoading('Оформление заказа...', 3000, 'crescent');
        this.orderService.createOrder(
            this.location.from.lat,
            this.location.from.lng,
            this.location.from.address,
            this.location.to.lat,
            this.location.to.lng,
            this.location.to.address
        ).subscribe(data => {
            this.currentStatus = data.status.code;
            this.currentOrder = data;
        }, error => {
            // this.presentLoading(error, 3000, 'dots');
        });
    }

    async presentLoading(text, duration = 0, spinner = null) {
        this.loader = await this.loadingController.create({
            spinner: spinner,
            duration: duration,
            message: text,
            translucent: true
        });
        await this.loader.present();
    }

    ionViewWillLeave() {
        if (this.toModal) {
            this.toModal.dismiss();
        }
    }

    prepareWsMessage(actionName, sendData) {
        return JSON.stringify({
            action: actionName,
            data: sendData
        });
    }

    cancelOrder(orderId: number) {
        this.orderService.orderCanceled(orderId).subscribe(data => {
            if (data) {
                this.presentLoading('Заказ отменен!', 3000, 'dots');
                this.currentStatus = 0;
            }
        });
    }
}
