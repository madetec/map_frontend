import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Network} from '@ionic-native/network/ngx';
import {Platform, ToastController} from '@ionic/angular';

export enum ConnectionStatus {
    Online,
    Offline
}

@Injectable({
    providedIn: 'root'
})
export class NetworkService {
    private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

    constructor(private network: Network, private toastCtrl: ToastController, private plt: Platform) {
        this.plt.ready().then(() => {
            this.initNetworkEvent();
            const status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
            this.status.next(status);
        });
    }

    public initNetworkEvent() {
        this.network.onDisconnect().subscribe(() => {
            if (this.status.getValue() === ConnectionStatus.Online) {
                this.updateNetworkStatus(ConnectionStatus.Offline);
            }
        });

        this.network.onConnect().subscribe(() => {
            if (this.status.getValue() === ConnectionStatus.Offline) {
                this.updateNetworkStatus(ConnectionStatus.Online);
            }
        });
    }

    private async updateNetworkStatus(status: ConnectionStatus) {
        this.status.next(status);
        const connection = status === ConnectionStatus.Offline ? 'Offline' : 'Online';
        const toast = this.toastCtrl.create({
            message: `Network: ${connection}`,
            duration: 5000,
            position: 'bottom'
        });
        toast.then(toast => toast.present());
    }

    public onNetworkChange(): Observable<ConnectionStatus> {
        return this.status.asObservable();
    }

    public getCurrentNetworkStatus(): ConnectionStatus {
        return this.status.getValue();
    }

}
