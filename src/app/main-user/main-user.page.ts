import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuController, Platform} from '@ionic/angular';
import * as L from 'leaflet/dist/leaflet.js';
import {User} from '../@core/models/user';
import {AuthService} from '../@core/services/auth.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Network} from '@ionic-native/network/ngx';

export interface Location {
    lat: number;
    lng: number;
}

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.page.html',
    styleUrls: ['./main-user.page.scss']
})
export class MainUserPage implements OnInit {
    @ViewChild('map') mapContainer: ElementRef;
    user: User;
    currentAddress: string;
    map: any;
    location: Location;
    pin_user_marker: any;
    constructor(
        private geolocation: Geolocation,
        private menuCtrl: MenuController,
        private platform: Platform,
        private service: AuthService
    ) {
        this.user = this.service.getCurrentUser;
        this.location = {
            lat: 41.310387,
            lng: 69.274695
        };
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
        this.updateLocation();
        this.updateAddress(this.location.lng, this.location.lat);
        setInterval(this.updateLocation, 1000);
        this.loadMap();

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
        const pin_a = L.icon({
            iconUrl: 'assets/icon/pin_a.svg',
            iconSize: [50, 62.3],
            shadowSize: [50, 62.3],
            iconAnchor: [25, 62.3],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        });
        const pin_user = L.icon({
            iconUrl: 'assets/icon/pin_user.svg',
            iconSize: [30, 30],
        });
        this.pin_user_marker = L.marker([
            this.location.lat,
            this.location.lng
        ], {icon: pin_user}).addTo(this.map);
        const pin_a_marker = L.marker([
            this.location.lat,
            this.location.lng
        ], {icon: pin_a}).addTo(this.map);
        this.map.on('move', (e) => this.onMove(e, pin_a_marker));
        this.map.on('moveend', (e) => this.onMoveEnd(e));
    }

    onMove(event, marker) {
        const position = event.target.getCenter();
        marker.setLatLng(position);
        this.clearAddress();
    }

    onMoveEnd(event) {
        const position = event.target.getCenter();
        console.log('updateAddress');
        this.updateAddress(position.lng, position.lat);
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
        } catch (e) {
        }
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
        const data = this.service.getTextCurrentLocation(lng, lat);
        const access_token = this.service.user.access_token;
        this.service.user.access_token = undefined;
        data.subscribe(res => {
            this.currentAddress = this.service.text;
        });
        this.service.user.access_token = access_token;
    }

    clearAddress() {
        this.currentAddress = null;
    }

    ngOnInit() {
    }
}
