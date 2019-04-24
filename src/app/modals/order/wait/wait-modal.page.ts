import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'wait-modal',
    templateUrl: './wait-modal.page.html',
    styleUrls: ['./wait-modal.page.scss'],
})
export class WaitModalPage implements OnInit {

    constructor(
        private modalCtrl: ModalController
    ) {
    }

    onDismiss(data) {
        this.modalCtrl.dismiss({'result': data});
    }

    ngOnInit() {
    }

}
