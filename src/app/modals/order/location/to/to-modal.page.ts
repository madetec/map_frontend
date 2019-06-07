import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {YaHelper} from '../../../../@core/helpers/yandex-geocoder.helper';
import {SubdivisionService} from '../../../../@core/services/subdivision.service';

@Component({
    selector: 'to-modal-page',
    templateUrl: './to-modal.page.html',
    styleUrls: ['./to-modal.page.scss'],
})
export class ToModalPage implements OnInit {
    @Input() value: number;
    public addresses: any;
    public subdivisions: any;

    constructor(
        navParams: NavParams,
        private modalCtrl: ModalController,
        private service: YaHelper,
        private subdivisionService: SubdivisionService
    ) {
        this.subdivisionService.subdivisions().subscribe(res => {
            if (res) {
                this.subdivisions = res;
            }
        });
    }

    onDismiss(data, subdivision = false) {
        this.modalCtrl.dismiss({'result': data, 'subdivision': subdivision});
    }

    onClickAddress(index, subdivision = false) {
        if (subdivision) {
            this.onDismiss(this.subdivisions[index], subdivision);
        } else {
            let latLng = this.addresses[index].GeoObject.Point.pos;
            latLng = latLng.split(' ');
            latLng[0] = parseFloat(latLng[0]);
            latLng[1] = parseFloat(latLng[1]);
            latLng.reverse();
            this.addresses[index].GeoObject.Point.pos = latLng;
            this.onDismiss(this.addresses[index]);
        }
    }

    onKeyup(e) {
        if (e.target.value.length === 0) {
            this.addresses = null;
        }
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
