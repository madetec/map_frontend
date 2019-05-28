import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import { OrderService } from 'src/app/@core/services/order.service';

@Component({
    selector: 'active-modal',
    templateUrl: './active-modal.page.html',
    styleUrls: ['./active-modal.page.scss'],
})
export class ActiveModalPage implements OnInit {
    @Input() activeOrder: any;
    constructor(
        private modalCtrl: ModalController,
        private orderService: OrderService
    ) {
        this.orderService.userOrderEmitter$.subscribe(data => {
            console.log(data);
        });
    }

    ionViewWillEnter() {
    }

    onDismiss(data) {
        this.modalCtrl.dismiss({'result': data});
    }

    ngOnInit() {
    }

}
