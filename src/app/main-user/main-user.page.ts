import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {MenuController, Platform} from '@ionic/angular';
import L from 'leaflet/dist/leaflet.js';
import {BehaviorSubject} from 'rxjs/index';
import {User} from '../@core/models/user';
import {AuthService} from '../@core/services/auth.service';


@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.page.html',
    styleUrls: ['./main-user.page.scss']
})
export class MainUserPage implements OnInit {
    @ViewChild('map') mapContainer: ElementRef;
    map: any;
    location = {lat: 41.310387, lng: 69.274695, data: null};
    currentLocationAddress = 'Текущее местоположение';
    pin_user_marker: any;

    private currentUserSubject: BehaviorSubject<User>;
    constructor(
        private geo: Geolocation,
        private menuCtrl: MenuController,
        private platform: Platform,
        private service: AuthService
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
        this.updateLocation();
        setInterval(this.updateLocation, 1000);
        this.loadMap();
        this.currentLocationAddress = localStorage.getItem('textCurrentLocation');
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
            iconSize: [30, 30], // size of the icon
        });
        this.pin_user_marker = L.marker([
            this.location.lat,
            this.location.lng
        ], {icon: pin_user}).addTo(this.map);
        const pin_a_marker = L.marker([
            this.location.lat,
            this.location.lng
        ], {icon: pin_a}).addTo(this.map);
        this.map.on('move', function (event) {
            pin_a_marker.setLatLng(this.getCenter());
        });
    }

    onPanTo() {
        this.map.panTo([
            this.location.lat,
            this.location.lng
        ]);
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
            this.geo.getCurrentPosition()
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
    }

    ngOnInit() {
        this.service.getTextCurrentLocation(this.location.lng, this.location.lat);
    }
}
