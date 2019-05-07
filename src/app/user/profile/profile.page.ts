import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {User} from '../../@core/models/user';

@Component({
    selector: 'profile-user',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss']
})
export class ProfilePage {
    public user: User = new User();

    constructor(private storage: Storage) {
        this.storage.get('current user').then(res => {
            if (res) {
                this.user = res;
            }
        });
    }
}
