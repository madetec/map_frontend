import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'active-modal',
    templateUrl: './active-modal.page.html',
    styleUrls: ['./active-modal.page.scss'],
})
export class ActiveModalPage implements OnInit {
    @Input() activeOrder: any;
    constructor(
        private modalCtrl: ModalController
    ) {
    }

    ionViewWillEnter() {
    }

    onDismiss(data) {
        this.modalCtrl.dismiss({'result': data});
    }

    ngOnInit() {
    }

}
