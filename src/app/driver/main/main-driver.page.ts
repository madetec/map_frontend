import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MenuController, IonSlides } from '@ionic/angular';
import * as L from 'leaflet/dist/leaflet.js';
import 'leaflet-routing-machine';
import { DriverService } from '../../@core/services/driver.service';
import { MapService } from '../../@core/services/map.service';
import { OrderService } from 'src/app/@core/services/order.service';
import {
    BackgroundGeolocation,
    BackgroundGeolocationConfig,
    BackgroundGeolocationResponse,
    BackgroundGeolocationEvents
} from '@ionic-native/background-geolocation/ngx';

@Component({
    selector: 'main-driver',
    templateUrl: './main-driver.page.html',
    styleUrls: ['./main-driver.page.scss'],
})
export class MainDriverPage implements OnInit, OnDestroy {
    @ViewChild('map') mapContainer: ElementRef;
    @ViewChild('slider') sliderContainer: IonSlides;
    map: L;
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

    constructor(
        private menuCtrl: MenuController,
        private driverService: DriverService,
        private orderService: OrderService,
        private mapService: MapService,
        private backgroundGeolocation: BackgroundGeolocation
    ) {
        this.location.lat = 41.310387;
        this.location.lng = 69.274695;
    }

    ngOnInit() {
        this.ordersList = this.orderService.getDriverOrders();
        this.orderService.driverOrdersEmitter$.subscribe(res => {
            this.ordersList = res;
        });
        const config: BackgroundGeolocationConfig = {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            debug: true, //  enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false // enable this to clear background location settings when the app terminates
        };

        this.backgroundGeolocation.configure(config).then(() => {
            this.backgroundGeolocation
                .on(BackgroundGeolocationEvents.location)
                .subscribe((location: BackgroundGeolocationResponse) => {
                    this.mapService.markers.pinDriver.move([location.latitude, location.longitude]);
                    alert(JSON.stringify(location));
                });
        });
        this.backgroundGeolocation.start();


    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
        this.loadMap();
        this.initStatus();
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
        this.orderService.takeDriverOrder(orderId).subscribe(res => {
            this.isDriverFree = false;
            this.activeOrder = res;
            this.setCurrentOrderRoute(this.activeOrder.from.lat, this.activeOrder.from.lng);
        });
    }

    startedOrder(orderId: number) {
        this.orderService.startedDriverOrder(orderId).subscribe(res => {
            this.activeOrder = res;
            this.setActiveOrderRoute(this.activeOrder.from, this.activeOrder.to);
        });
    }

    completedOrder(orderId: number) {
        this.orderService.completedDriverOrder(orderId).subscribe(res => {
            this.isDriverFree = true;
            this.activeOrder = undefined;
            console.log(res);
        });
    }

    cancelOrder(orderId: number) {
        this.orderService.cancelDriverOrder(orderId).subscribe(res => {
            console.log(res);
        });
    }

    ngOnDestroy() {
        this.backgroundGeolocation.finish();
        this.backgroundGeolocation.stop();
    }

}
