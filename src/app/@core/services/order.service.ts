import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class OrderService {

    driverOrders = [];
    public driverOrdersEmitter$: EventEmitter<any>;

    constructor(
        private http: HttpClient
    ) {
        this.driverOrdersEmitter$ = new EventEmitter();
    }

    orderCanceled(orderId) {
        return this.http.patch <any>('http://api.telecom-car.uz/user/order/' + orderId + '/cancel', {});
    }

    getActiveOrder() {
        return this.http.get <any>('http://api.telecom-car.uz/user/order/active');
    }

    getOrders() {
        return this.http.get <any>('http://api.telecom-car.uz/user/order');
    }

    getOrder(id: number) {
        return this.http.get <any>(`http://api.telecom-car.uz/user/order/${id}`);
    }

    createOrder(from_lat: number, from_lng: number, from_address: string, to_lat: number, to_lng: number, to_address: string) {
        const data = {
            from_lat: from_lat,
            from_lng: from_lng,
            from_address: from_address,
            to_lat: to_lat,
            to_lng: to_lng,
            to_address: to_address
        };
        return this.http.post <any>('http://api.telecom-car.uz/user/order', data);
    }

    getDriverOrders() {
        return this.driverOrders;
    }

    newDriverOrder(id: number) {
        this.getOrder(id).subscribe(data => {
            this.driverOrders.push(data);
            this.driverOrdersEmitter$.emit(this.driverOrders);
        });
    }
}
