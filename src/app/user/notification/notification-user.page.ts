import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../@core/services/notification.service';

@Component({
    selector: 'app-notification-user',
    templateUrl: './notification-user.page.html',
    styleUrls: ['./notification-user.page.scss'],
})
export class NotificationUserPage implements OnInit {
    public notifications;

    constructor(private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.notificationService.getAll().subscribe(res => {
            if (res) {
                this.notifications = res;
            }
        });
    }

}
