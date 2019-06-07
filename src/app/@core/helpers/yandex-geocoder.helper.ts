import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class YaHelper {
    constructor(private http: HttpClient) {
    }

    getTextCurrentLocation(geocode) {
        if (Array.isArray(geocode)) {
            geocode = geocode.join();
        } else if (typeof geocode === 'string') {
            geocode = geocode.split(/ /g).join('+');
            if (/[а-яА-ЯЁё]/.test(geocode)) {
                geocode = 'Узбекистан,' + geocode;
            } else {
                geocode = 'Uzbekistan,' + geocode;
            }
        }
        return this.http.get<any>('https://geocode-maps.yandex.ru/1.x/', {
            params: {
                apiKey: '28dabf92-4d44-4291-a67b-ebee0a411fb2',
                format: 'json',
                geocode: geocode
            }
        }).pipe(map(data => {
            if (data) {
                return data.response;
            }
            return null;
        }));
    }

    getAddress(data: any) {
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
