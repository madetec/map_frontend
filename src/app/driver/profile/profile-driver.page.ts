import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {User} from '../../@core/models/user';

@Component({
    selector: 'profile-driver',
    templateUrl: './profile-driver.page.html',
    styleUrls: ['./profile-driver.page.scss']
})
export class ProfileDriverPage {
    public user: User = new User();
    constructor(private storage: Storage) {
        this.storage.get('current user').then(res => {
            if (res) {
                this.user = res;
            }
        });
    }
}
