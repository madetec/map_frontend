import {Component, OnInit} from '@angular/core';
import {OrderService} from '../@core/services/order.service';

@Component({
    selector: 'order-history',
    templateUrl: './order-history.page.html',
    styleUrls: ['./order-history.page.scss']
})
export class OrderHistoryPage implements OnInit {
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
