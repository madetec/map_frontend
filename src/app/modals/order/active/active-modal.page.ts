import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'active-modal',
    templateUrl: './active-modal.page.html',
    styleUrls: ['./active-modal.page.scss'],
})
export class ActiveModalPage implements OnInit {

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
