import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoadingController, MenuController, ModalController} from '@ionic/angular';
import * as L from 'leaflet/dist/leaflet.js';
import 'leaflet-routing-machine';
import {User} from '../../@core/models/user';
import {Markers} from '../../@core/models/markers';
import {ToModalPage} from '../../modals/order/location/to/to-modal.page';
import {YaHelper} from '../../@core/helpers/yandex-geocoder.helper';
import {OrderService} from '../../@core/services/order.service';
import {AuthenticationService} from '../../@core/services/authentication.service';
import {SubdivisionService} from '../../@core/services/subdivision.service';
import {GeolocationService} from '../../@core/services/geolocation.service';
import {WebsocketService} from '../../@core/services/websocket.service';

@Component({
    selector: 'main-user',
    templateUrl: './main-user.page.html',
    styleUrls: ['./main-user.page.scss']
})
export class MainUserPage {
    ws: any;
    @ViewChild('map') mapContainer: ElementRef;
    markers: Markers = new Markers();
    user: User;
    map: L;
    routerControl: any;
    toModal: any;
    loader: any;
    currentStatus: any;
    currentOrder: any;
    currentOrderMsg;

    subdivisions: any;

    location = {
        lat: 41.325306,
        lng: 69.317139,
        from: {
            lat: 41.325306,
            lng: 69.317139,
            address: ''
        },
        to: {
            lat: 0,
            lng: 0,
            address: 'Куда?'
        }
    };

    constructor(
        private geoService: GeolocationService,
        private menuCtrl: MenuController,
        public modalController: ModalController,
        public loadingController: LoadingController,
        public orderService: OrderService,
        private yaHelper: YaHelper,
        private authService: AuthenticationService,
        private subdivisionService: SubdivisionService,
        private websocket: WebsocketService
    ) {
        this.currentStatus = 0;
        this.updateUserLocation();
        this.updateOrder();
        authService.getCurrentUser().subscribe(user => {
            if (user) {
                this.user = user;
            }
        });
        this.orderService.userOrderEmitter$.subscribe(data => {
            switch (data.type) {
                case 'take_order':
                    this.updateOrder();
                    this.presentLoading('Водитель в пути', 500, 'crescent');
                    this.currentStatus = 45;
                    break;
                case 'driver_is_waiting':
                    this.presentLoading('Водитель приехал и ожидает', 500, 'crescent');
                    this.currentStatus = 50;
                    break;
                case 'started_order':
                    this.presentLoading('Водитель начал выполнение заказа', 500, 'crescent');
                    this.currentStatus = 55;
                    break;
                case 'completed_order':
                    this.presentLoading('Водитель выполнил заказ', 500, 'crescent');
                    this.currentStatus = 0;
                    break;
                case 'cancel_order':
                    this.presentLoading('Водитель отменил заказ', 500, 'crescent');
                    this.currentStatus = 0;
                    break;
                default:
                    this.currentStatus = 0;
                    break;
            }
            this.currentOrderMsg = data.body;
        });
    }

    updateOrder() {
        this.orderService.getActiveOrder().subscribe(res => {
            if (res) {
                this.currentOrder = res;
                this.currentStatus = 10;
            }
        });
    }


    ionViewWillEnter() {
        this.menuCtrl.enable(true);
        this.loadMap();
        this.websocket.initWs(this.user.profile.user_id, this.location.lat, this.location.lng);
        this.updateAddress(this.location.from.lng, this.location.from.lat);
    }

    async toModalPresent() {
        this.toModal = await this.modalController.create({
            component: ToModalPage,
            componentProps: {value: 123}
        });
        await this.toModal.present();
        const {data} = await this.toModal.onDidDismiss();
        let latLng = null;
        if (data.result !== 'cancel') {
            if (data.subdivision) {
                this.location.to.address = data.result.address;
                latLng = [data.result.lat, data.result.lng];
            } else {
                this.location.to.address = data.result.GeoObject.name;
                latLng = data.result.GeoObject.Point.pos;
            }
            if (!this.markers.pinB) {
                this.markers.setPinBLatLng(latLng);
                this.markers.pinB.addTo(this.map);
            } else {
                this.markers.pinB.setLatLng({lat: latLng[0], lng: latLng[1]});
            }
            this.routerControl.spliceWaypoints(0, 1, L.latLng(this.location.from.lat, this.location.from.lng));
            this.routerControl.spliceWaypoints(this.routerControl.getWaypoints().length - 1, 1, L.latLng(latLng[0], latLng[1]));

            // const bounds = new L.LatLngBounds([
            //     [this.location.from.lat, this.location.from.lng],
            //     [latLng[0], latLng[1]],
            // ]);
            // this.map.fitBounds(bounds);
            // const zoom = this.map.getBoundsZoom(bounds);
            // this.map.setZoom(zoom - 1);

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
        this.routerControl = L.Routing.control({
            fitSelectedRoutes: true,
            routeWhileDragging: false
        })
        .addTo(this.map);
        this.routerControl.hide();
        // this.routerControl.spliceWaypoints(0, 1, L.latLng(this.location.from.lat, this.location.from.lng));

        this.markers.setPinUserLatLng([this.location.lat, this.location.lng]);
        this.markers.pinUser.addTo(this.map);

        this.map.on('move', (e) => this.onMove(e, this.markers.pinA));
        this.map.on('moveend', (e) => this.onMoveEnd(e));
        this.subdivisionService.subdivisions().subscribe(res => {
            if (res) {
                for (let i = 0; i < res.length; i++) {
                    const marker = L.marker([res[i].lat, res[i].lng], {
                        icon: L.icon({
                            iconUrl: 'assets/icon/marker-icon.png',
                            shadowUrl: 'assets/icon/marker-shadow.png',
                            iconAnchor: [12, 41],
                            popupAnchor: [0, -41]
                        })
                    }).addTo(this.map);
                    marker.bindPopup(`<p><b>${res[i].name}</b></p><p>${res[i].address}</p>`);
                }
            }
        });
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
        this.updateUserLocation();
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
        if (this.ws) {
            this.websocket.send('coordinates', {'lat': lat, 'lng': lng});
        }
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
            this.geoService.getGeolocation();
            this.setUserLocation(this.geoService.lat, this.geoService.lng);
            this.updateAddress(this.geoService.lng, this.geoService.lat);
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
        this.routerControl.getPlan().setWaypoints([]);
    }

    clearAddress() {
        this.location.from.address = '';
    }

    onSubmit() {
        this.presentLoading('Оформление заказа...', 1000, 'crescent');
        // this.websocket.send('createOrder', {
        //     'from_lat': this.location.from.lat,
        //     'from_lng': this.location.from.lng,
        //     'from_address': this.location.from.address,
        //     'to_lat': this.location.to.lat,
        //     'to_lng': this.location.to.lng,
        //     'to_address': this.location.to.address
        // });
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
            this.presentLoading(JSON.stringify(error), 500, 'dots');
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
        this.map.eachLayer(function (layer) {
            layer.remove();
        });
        this.map.remove();
    }


    cancelOrder(orderId: number) {
        this.orderService.orderCanceled(orderId).subscribe(data => {
            if (data) {
                this.presentLoading('Заказ отменен!', 1000, 'dots');
                this.currentStatus = 0;
            }
        });
    }

}
