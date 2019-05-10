import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../../@core/services/order.service';

@Component({
    selector: 'order-user-history',
    templateUrl: './order-user-history.page.html',
    styleUrls: ['./order-user-history.page.scss']
})
export class OrderUserHistoryPage implements OnInit {
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
