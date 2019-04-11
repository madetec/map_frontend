import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {MenuController} from '@ionic/angular';
import L from 'leaflet/dist/leaflet.js';

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.page.html',
    styleUrls: ['./main-user.page.scss']
})
export class MainUserPage implements OnInit {
    @ViewChild('map') mapContainer: ElementRef;
    map: any;
    location = {lat: 41.310997, lng: 69.277880};
    currentLocationAddress = 'Текущее местоположение';

    constructor(
        public geo: Geolocation,
        private menuCtrl: MenuController
    ) {
    }
  ngOnInit() {
      setInterval(this.updateLocation, 1000);
      this.geo.getCurrentPosition().then((position) => {
          this.location.lat = position.coords.latitude;
          this.location.lng = position.coords.longitude;
      });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
      this.loadmap();
  }

    loadmap() {
        this.map = L.map('map', {
            center: [
                this.location.lat,
                this.location.lng
            ],
            zoomControl: false,
            zoom: 15
        });
        L.tileLayer('https://map.uztelecom.uz/hot/{z}/{x}/{y}.png', {
            attributions: 'https://telecom-car.uz',
            maxZoom: 18
        }).addTo(this.map);

        const userIcon = L.icon({
            iconUrl: 'assets/icon/user.svg',
            iconSize: [38, 95], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        const mainMarker = L.marker([
            this.location.lat,
            this.location.lng
        ], {icon: userIcon}).addTo(this.map);

        this.map.on('move', function (event) {
            mainMarker.setLatLng(this.getCenter());
        });
    }

    onPanTo() {
        this.map.panTo([
            this.location.lat,
            this.location.lng
        ]);
        setTimeout(function () {
            (document).getElementById('centralization').classList.add('cbutton--click');
        }, 150);
        setTimeout(function () {
            (document).getElementById('centralization').classList.remove('cbutton--click');
        }, 700);
    }

    updateLocation() {
        try {
            this.geo.getCurrentPosition().then((position) => {
                this.location.lat = position.coords.latitude;
                this.location.lng = position.coords.longitude;
            });
        } catch (e) {
            console.log(e);
        }
    }

}
