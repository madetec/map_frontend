import {Injectable} from '@angular/core';

@Injectable()
export class YaHelper {
    constructor() {
    }

    public getAddress(data: any) {
        let latlng = data.GeoObjectCollection
            .featureMember[0]
            .GeoObject
            .Point
            .pos;
        latlng = latlng.split(' ');
        latlng[0] = parseFloat(latlng[0]);
        latlng[1] = parseFloat(latlng[1]);
        latlng.reverse();
        return {
            address: data.GeoObjectCollection.featureMember[0].GeoObject.name,
            lat: latlng[0],
            lng: latlng[1]
        };
    }
}