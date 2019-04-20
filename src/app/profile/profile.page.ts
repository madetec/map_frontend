import {Component, OnInit} from '@angular/core';
import {AuthService} from '../@core/services/auth.service';
import {User} from '../@core/models/user';

@Component({
    selector: 'profile-user',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
    public user: User;

    constructor(private authService: AuthService) {
    }
    ngOnInit() {
        this.user = this.authService.getCurrentUser;
    }
}
