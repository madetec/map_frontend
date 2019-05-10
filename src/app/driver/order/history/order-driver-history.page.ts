import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../../@core/services/order.service';

@Component({
    selector: 'order-driver-history',
    templateUrl: './order-driver-history.page.html',
    styleUrls: ['./order-driver-history.page.scss']
})
export class OrderDriverHistoryPage implements OnInit {
    public orders: any;

    constructor(private orderService: OrderService) {
        this.orders = null;
    }

    ngOnInit() {
        this.orderService.getOrders()
            .subscribe(data => {
                this.orders = data;
            });
    }
}
