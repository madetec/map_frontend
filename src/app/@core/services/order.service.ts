import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class OrderService {

    driverOrders = [];
    public driverOrdersEmitter$: EventEmitter<any>;
    public userOrderEmitter$: EventEmitter<any>;

    constructor(
        private http: HttpClient
    ) {
        this.driverOrdersEmitter$ = new EventEmitter();
        this.userOrderEmitter$ = new EventEmitter();
    }

    orderCanceled(orderId) {
        return this.http.patch <any>('http://api.telecom-car.uz/user/order/' + orderId + '/cancel', {});
    }

    getActiveOrder() {
        return this.http.get <any>('http://api.telecom-car.uz/user/order/active');
    }

    getActiveOrderForDriver() {
        return this.http.get <any>('http://api.telecom-car.uz/driver/order/active');
    }

    getOrders() {
        return this.http.get <any>('http://api.telecom-car.uz/user/order');
    }

    getDriverOrder(id: number) {
        return this.http.get <any>(`http://api.telecom-car.uz/driver/order/${id}`);
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
        this.getDriverOrder(id).subscribe(data => {
            if (data.status.code === 10) {
                this.driverOrders.push(data);
                this.driverOrdersEmitter$.emit(this.driverOrders);
            } else if (data.status.code === 20) {
                this.driverOrders = [];
                this.driverOrdersEmitter$.emit(this.driverOrders);
            }
        });
    }

    removeDriverOrder(id: number) {
        this.driverOrders.filter( order => {
            return order.id === id;
        });
        for (let i = 0; i < this.driverOrders.length; i++) {
            let obj = this.driverOrders[i];
            if (obj.id === id) {
                this.driverOrders.splice(i, 1);
            }
        }
    }

    takeDriverOrder(orderId: number) {
        return this.http.patch <any>('http://api.telecom-car.uz/driver/order/' + orderId + '/take', {});
    }

    waitingDriverOrder(orderId: number) {
        return this.http.patch <any>('http://api.telecom-car.uz/driver/order/' + orderId + '/waiting', {});
    }

    startedDriverOrder(orderId: number) {
        return this.http.patch <any>('http://api.telecom-car.uz/driver/order/' + orderId + '/started', {});
    }

    completedDriverOrder(orderId: number) {
        return this.http.patch <any>('http://api.telecom-car.uz/driver/order/' + orderId + '/completed', {});
    }

    cancelDriverOrder(orderId: number) {
        return this.http.patch <any>('http://api.telecom-car.uz/driver/order/' + orderId + '/cancel', {});
    }

    userOrderNotif(order: any) {
        this.userOrderEmitter$.emit(order);
    }
}
