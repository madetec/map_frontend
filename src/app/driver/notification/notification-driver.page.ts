import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../@core/services/notification.service';

@Component({
    selector: 'app-notification-driver',
    templateUrl: './notification-driver.page.html',
    styleUrls: ['./notification-driver.page.scss'],
})
export class NotificationDriverPage implements OnInit {
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
