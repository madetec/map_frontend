import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SubdivisionService {

    constructor(private http: HttpClient) {
    }

    subdivisions() {
        return this.http.get<any>('http://api.telecom-car.uz/subdivisions', {});
    }
}
