import { Component, OnInit } from '@angular/core';
import { AuthService } from '../@core/services/auth.service';

@Component({
    selector: 'profile-user',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {

    public user: Object;

    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.getProfile().subscribe(data => {
            this.user = data;
        });
    }
}
