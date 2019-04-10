import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'order-history',
    templateUrl: './order-history.page.html',
    styleUrls: ['./order-history.page.scss']
})
export class OrderHistoryPage implements OnInit {

    constructor() {
    }

    ngOnInit() {
        // подправить дизайн по шаблону
        // проверить за логинен ли пользователь
        // запрос GET с Authorization: Bearer token -> на http://api.telecom-car.uz/user/order
    }
}
