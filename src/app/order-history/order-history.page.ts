import {Component, OnInit} from '@angular/core';
import {OrderRepositoryService} from '../@core/repositories/order/order-repository.service';
@Component({
    selector: 'order-history',
    templateUrl: './order-history.page.html',
    styleUrls: ['./order-history.page.scss']
})
export class OrderHistoryPage implements OnInit {
    public orders: any;

    constructor(private repository: OrderRepositoryService) {
        this.orders = null;
    }
    ngOnInit() {
        this.repository.getOrders()
            .subscribe(data => {
                this.orders = data;
            });
    }
}
