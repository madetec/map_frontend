import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import * as L from 'leaflet/dist/leaflet.js';
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

    map: L;
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
        // this.orderService.newDriverOrder(71);
        // this.orderService.newDriverOrder(72);
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
        this.map = this.mapService.createMap(this.location.lat, this.location.lng, 15);
        this.map = this.mapService.addDriverMarker(this.location.lat, this.location.lng);
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