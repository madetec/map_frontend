import {Injectable} from '@angular/core';
import * as L from 'leaflet/dist/leaflet.js';
import {Markers} from '../models/markers';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    public map: L;
    public markers = new Markers();

    constructor() {
    }

    createMap(lat, lng, zoom) {
        this.map = L.map('map', {
            center: [lat, lng],
            zoom: zoom,
            zoomControl: false
        });

        L.tileLayer('https://map.uztelecom.uz/hot/{z}/{x}/{y}.png', {
            attributions: 'https://telecom-car.uz',
            maxZoom: 18
        }).addTo(this.map);
        return this.map;
    }

    setDriverMarker(lat, lng) {
        if (!this.markers.pinDriver) {
            this.markers.setPinDriverLatLng([lat, lng]);
            this.markers.pinDriver.addTo(this.map);
        } else {
            this.markers.pinDriver.setLatLng({lat: lat, lng: lng});
        }
        return this.map;
    }

    setPinAMarker(lat, lng) {
        if (!this.markers.pinA) {
            this.markers.setPinALatLng([lat, lng]);
            this.markers.pinA.addTo(this.map);
        } else {
            this.markers.pinA.setLatLng({lat: lat, lng: lng});
        }
        return this.map;
    }

    setPinBMarker(lat, lng) {
        if (!this.markers.pinB) {
            this.markers.setPinBLatLng([lat, lng]);
            this.markers.pinB.addTo(this.map);
        } else {
            this.markers.pinB.setLatLng({lat: lat, lng: lng});
        }
        return this.map;
    }
}
