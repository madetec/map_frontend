import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IonSlides, LoadingController, MenuController} from '@ionic/angular';
import * as L from 'leaflet/dist/leaflet.js';
import 'leaflet-routing-machine';
import {DriverService} from '../../@core/services/driver.service';
import {MapService} from '../../@core/services/map.service';
import {OrderService} from 'src/app/@core/services/order.service';
import {User} from 'src/app/@core/models/user';
import {AuthenticationService} from 'src/app/@core/services/authentication.service';
import {WebsocketService} from '../../@core/services/websocket.service';

@Component({
    selector: 'main-driver',
    templateUrl: './main-driver.page.html',
    styleUrls: ['./main-driver.page.scss'],
})
export class MainDriverPage implements OnInit {
    @ViewChild('map') mapContainer: ElementRef;
    @ViewChild('slider') sliderContainer: IonSlides;

    map: L;
    socket: any;
    user: User;
    routerControl: any;
    location = {
        lat: 0,
        lng: 0,
    };
    status = false;
    slideConfig = {
        spaceBetween: 5,
        slidesPerView: 2,
        centeredSlides: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    };
    ordersList: any[];
    isDriverFree: boolean = true;
    activeOrder: any;
    ws: WebSocket;
    constructor(
        private menuCtrl: MenuController,
        private driverService: DriverService,
        private orderService: OrderService,
        private mapService: MapService,
        private authService: AuthenticationService,
        private loadingController: LoadingController,
        private websocket: WebsocketService
    ) {
        authService.getCurrentUser().subscribe(user => {
            if (user) {
                this.user = user;
            }
        });
        this.location.lat = 41.310387;
        this.location.lng = 69.274695;
    }

    async presentLoading(text, duration = 0, spinner = null) {
        const loader = await this.loadingController.create({
            spinner: spinner,
            duration: duration,
            message: text,
            translucent: true
        });
        await loader.present();
    }

    ngOnInit() {
        this.ordersList = this.orderService.getDriverOrders();
        this.orderService.driverOrdersEmitter$.subscribe(res => {
            if (res.length === 0) {
                this.presentLoading('Пользователь отменил заказ.', 500, 'crescent');
                this.ordersList = [];
                this.isDriverFree = true;
                this.changeStatus();
                this.status = false;
                this.activeOrder = undefined;
                this.routerControl.getPlan().setWaypoints([]);
                this.map.eachLayer(function (layer) {
                    layer.remove();
                });
                this.map.remove();
                this.loadMap();
            } else {
                this.presentLoading('Новый заказ', 500, 'crescent');
                this.ordersList = res;
            }
        });
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
        this.loadMap();
        this.initStatus();
        this.websocket.initWs(this.user.profile.user_id, this.location.lat, this.location.lng);
    }

    loadMap() {
        this.map = this.mapService.createMap(this.location.lat, this.location.lng, 14);
        this.map = this.mapService.setDriverMarker(this.location.lat, this.location.lng);
        this.routerControl = L.Routing.control({
            fitSelectedRoutes: true,
            routeWhileDragging: false
        })
        .addTo(this.map);
        this.routerControl.hide();
        this.routerControl.spliceWaypoints(0, 1, L.latLng(this.location.lat, this.location.lng));
    }

    slideLoaded() {
        this.setCurrentOrderRoute(this.ordersList[0].from.lat, this.ordersList[0].from.lng);
    }

    slideChanged() {
        this.sliderContainer.getActiveIndex().then(index => {
            this.setCurrentOrderRoute(this.ordersList[index].from.lat, this.ordersList[index].from.lng);
        });
    }

    setCurrentOrderRoute(lat, lng) {
        this.routerControl.spliceWaypoints(this.routerControl.getWaypoints().length - 1, 1, L.latLng(lat, lng));
        this.map = this.mapService.setPinAMarker(lat, lng);
    }

    setActiveOrderRoute(from, to) {
        this.routerControl.spliceWaypoints(0, 1, L.latLng(from.lat, from.lng));
        this.routerControl.spliceWaypoints(this.routerControl.getWaypoints().length - 1, 1, L.latLng(to.lat, to.lng));
        this.map = this.mapService.setPinAMarker(from.lat, from.lng);
        this.map = this.mapService.setPinBMarker(to.lat, to.lng);
    }

    initStatus() {
        this.driverService.getCurrentStatus().subscribe(res => {
            this.status = res;
        });
    }

    changeStatus(): void {
        if (this.status) {
            this.driverService.busy();
            this.initStatus();
        } else {
            this.driverService.active();
            this.initStatus();
        }
    }

    takeOrder(orderId: number) {
        this.orderService.takeDriverOrder(orderId).subscribe( res => {
            this.isDriverFree = false;
            this.status = true;
            this.changeStatus();
            this.activeOrder = res;
            this.setCurrentOrderRoute(this.activeOrder.from.lat, this.activeOrder.from.lng);
        });
    }

    waitingOrder(orderId: number) {
        this.orderService.waitingDriverOrder(orderId).subscribe( res => {
            this.activeOrder = res;
            this.setActiveOrderRoute(this.activeOrder.from, this.activeOrder.to);
        });
    }

    startedOrder(orderId: number) {
        this.orderService.startedDriverOrder(orderId).subscribe( res => {
            this.activeOrder = res;
            this.setActiveOrderRoute(this.activeOrder.from, this.activeOrder.to);
        });
    }

    completedOrder(orderId: number) {
        this.orderService.completedDriverOrder(orderId).subscribe( res => {
            this.isDriverFree = true;
            this.status = false;
            this.changeStatus();
            this.activeOrder = undefined;
            this.orderService.removeDriverOrder(orderId);
            this.routerControl.getPlan().setWaypoints([]);
        });
    }

    cancelOrder(orderId: number) {
        this.isDriverFree = true;
        this.status = false;
        this.changeStatus();
        this.activeOrder = undefined;
        this.orderService.removeDriverOrder(orderId);
        this.mapService.map.eachLayer(function (layer) {
            layer.remove();
        });
        this.mapService.map.remove();
        this.loadMap();
        this.routerControl.getPlan().setWaypoints([]);
    }
}
