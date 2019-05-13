import {Component, ElementRef, ViewChild} from '@angular/core';
import {MenuController, Platform} from '@ionic/angular';
import * as L from 'leaflet/dist/leaflet.js';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Markers} from '../../@core/models/markers';
import {YaHelper} from '../../@core/helpers/yandex-geocoder.helper';
import {Storage} from '@ionic/storage';
import {DriverService} from '../../@core/services/driver.service';
import {MapService} from '../../@core/services/map.service';


@Component({
    selector: 'main-driver',
  templateUrl: './main-driver.page.html',
  styleUrls: ['./main-driver.page.scss'],
})
export class MainDriverPage {
  @ViewChild('map') mapContainer: ElementRef;
  map: L;
  location = {
      lat: 0,
      lng: 0,
  };
    status = false;
  constructor(
      private geolocation: Geolocation,
      private menuCtrl: MenuController,
      private platform: Platform,
      private yaHelper: YaHelper,
      private storage: Storage,
      private driverService: DriverService,
      private mapService: MapService
  ) {
      this.location.lat = 41.310387;
      this.location.lng = 69.274695;
  }

    ionViewWillEnter() {
      this.menuCtrl.enable(true);
      this.loadMap();
        this.initStatus();
        // this.updateDriverLocation();
        // setInterval(this.updateDriverLocation, 1000);
    }

    // setDriverLocation(lat: number, lng: number) {
    //     this.location.lat = lat;
    //     this.location.lng = lng;
    //     this.markers.pinDriver.setLatLng({
    //         lat: this.location.lat,
    //         lng: this.location.lng
    //     });
    //     this.map.panTo([
    //         this.location.lat,
    //         this.location.lng
    //     ]);
    // }

    // updateDriverLocation() {
    //     try {
    //         this.geolocation.getCurrentPosition()
    //             .then((position) => this.setDriverLocation(position.coords.latitude, position.coords.longitude));
    //     } catch (e) {
    //     }
    // }

    loadMap() {
        this.map = this.mapService.createMap(this.location.lat, this.location.lng, 15);
        this.map = this.mapService.addDriverMarker(this.location.lat, this.location.lng);
        // this.map = L.map('map', {
        //     center: [this.location.lat, this.location.lng],
        //     zoom: 15,
        //     zoomControl: false
        // });
        //
        // L.tileLayer('https://map.uztelecom.uz/hot/{z}/{x}/{y}.png', {
        //     attributions: 'https://telecom-car.uz',
        //     maxZoom: 18
        // }).addTo(this.map);

        // this.markers.setPinDriverLatLng([this.location.lat, this.location.lng]);
        // this.markers.pinDriver.addTo(this.map);
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
}
