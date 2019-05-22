import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuController, IonSlides } from '@ionic/angular';
import * as L from 'leaflet/dist/leaflet.js';
import 'leaflet-routing-machine';
import { DriverService } from '../../@core/services/driver.service';
import { MapService } from '../../@core/services/map.service';
import { OrderService } from 'src/app/@core/services/order.service';

@Component({
    selector: 'main-driver',
    templateUrl: './main-driver.page.html',
    styleUrls: ['./main-driver.page.scss'],
})
export class MainDriverPage implements OnInit {
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

    constructor(
        private menuCtrl: MenuController,
        private driverService: DriverService,
        private orderService: OrderService,
        private mapService: MapService
    ) {
        this.location.lat = 41.310387;
        this.location.lng = 69.274695;
    }

    ngOnInit() {
        // this.orderService.newDriverOrder(72);
        // this.orderService.newDriverOrder(76);
        // this.orderService.newDriverOrder(77);
        this.ordersList = this.orderService.getDriverOrders();
        this.orderService.driverOrdersEmitter$.subscribe(res => {
            this.ordersList = res;
        });
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
        this.loadMap();
        this.initStatus();
    }

    loadMap() {
        this.map = this.mapService.createMap(this.location.lat, this.location.lng, 14);
        this.map = this.mapService.addDriverMarker(this.location.lat, this.location.lng);
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
        this.mapService.setPinAMarker(lat, lng);
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
            console.log(res);
        });
    }

    cancelOrder(orderId: number) {
        this.orderService.cancelDriverOrder(orderId).subscribe( res => {
            console.log(res);
        });
    }
}