import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Platform} from '@ionic/angular';
import {Profile} from '../models/profile';

@Injectable({
    providedIn: 'root'
})
export class DriverService {
    currentStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private http: HttpClient,
        private platform: Platform
    ) {
        this.platform.ready().then(() => {
            this.checkToken();
        });
    }

    getCurrentStatus() {
        return this.currentStatus.asObservable();
    }

    checkToken() {
        return this.http.get<Profile>('http://api.telecom-car.uz/user/profile')
            .subscribe(profile => {
                    if (profile) {
                        if (this.isStatusActive(profile.status.code)) {
                            this.currentStatus.next(true);
                        } else if (this.isStatusBusy(profile.status.code)) {
                            this.currentStatus.next(false);
                        }
                    }
                }
            );
    }

    activeStatus() {
        return this.http.patch('http://api.telecom-car.uz/driver/status/active', null);
    }

    busyStatus() {
        return this.http.patch('http://api.telecom-car.uz/driver/status/busy', null);
    }

    active() {
        return this.activeStatus().subscribe(res => {
            if (res) {
                this.currentStatus.next(true);
            }
        });
    }

    busy() {
        return this.busyStatus().subscribe(res => {
            if (res) {
                this.currentStatus.next(false);
            }
        });
    }

    isStatusActive(statusCode): boolean {
        return statusCode === 10;
    }

    isStatusBusy(statusCode): boolean {
        return statusCode === 15;
    }
}
