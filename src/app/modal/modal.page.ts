import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {AuthService} from '../@core/services/auth.service';

@Component({
    selector: 'modal-page',
    templateUrl: './modal.page.html',
    styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
    @Input() value: number;
    private addresses: any;

    constructor(
        navParams: NavParams,
        private modalController: ModalController,
        private service: AuthService) {
    }

    onDismiss(data) {
        this.modalController.dismiss({'result': data});
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
