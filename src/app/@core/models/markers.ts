import * as L from 'leaflet/dist/leaflet.js';

export class Markers {
    protected iconPinA: object;
    protected iconPinB: object;
    public iconUser: object;
    public iconDriver: object;
    public pinA: L;
    public pinB: L;
    public pinUser: L;
    public pinDriver: L;

    constructor() {
        this.iconPinA = L.icon({
            iconUrl: 'assets/icon/pin_a.svg',
            iconSize: [50, 62.3],
            shadowSize: [50, 62.3],
            iconAnchor: [25, 62.3],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        });
        this.iconPinB = L.icon({
            iconUrl: 'assets/icon/pin_b.svg',
            iconSize: [50, 62.3],
            shadowSize: [50, 62.3],
            iconAnchor: [25, 62.3],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        });
        this.iconUser = L.icon({
            iconUrl: 'assets/icon/pin_user.svg',
            iconSize: [30, 30],
        });
        this.iconDriver = L.icon({
            iconUrl: 'assets/icon/pin_driver.svg',
            iconSize: [30, 30],
        });
    }

    setPinALatLng(latLng: number[]) {
        this.pinA = L.marker(latLng, {icon: this.iconPinA});
    }

    setPinBLatLng(latLng: number[]) {
        this.pinB = L.marker(latLng, {icon: this.iconPinB});
    }

    setPinUserLatLng(latLng: number[]) {
        this.pinUser = L.marker(latLng, {icon: this.iconUser});
    }

    setPinDriverLatLng(latLng: number[]) {
        this.pinDriver = L.marker(latLng, {icon: this.iconDriver});
    }
}