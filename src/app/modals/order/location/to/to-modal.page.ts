import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {AuthService} from '../../../../@core/services/auth.service';

@Component({
    selector: 'to-modal-page',
    templateUrl: './to-modal.page.html',
    styleUrls: ['./to-modal.page.scss'],
})
export class ToModalPage implements OnInit {
    @Input() value: number;
    public addresses: any;

    constructor(
        navParams: NavParams,
        private modalCtrl: ModalController,
        private service: AuthService) {
    }

    onDismiss(data) {
        this.modalCtrl.dismiss({'result': data});
    }

    onClickAddress(index) {
        let latLng = this.addresses[index].GeoObject.Point.pos;
        latLng = latLng.split(' ');
        latLng[0] = parseFloat(latLng[0]);
        latLng[1] = parseFloat(latLng[1]);
        latLng.reverse();
        this.addresses[index].GeoObject.Point.pos = latLng;
        this.onDismiss(this.addresses[index]);
    }

    onKeyup(e) {
        if (e.target.value.length >= 3) {
            const data = this.service.getTextCurrentLocation(e.target.value);
            data.subscribe(res => {
                this.setAddresses(res.GeoObjectCollection);
            });
        }
    }

    setAddresses(addresses) {
        if (addresses.metaDataProperty.GeocoderResponseMetaData.found !== '0') {
            this.addresses = addresses.featureMember;
        } else {
            this.addresses = null;
        }
    }

    ngOnInit() {
    }

}
