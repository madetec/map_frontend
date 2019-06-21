import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export enum ConnectionStatus {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    url = 'wss://telecom-car.uz/ws';
    params: any;
    ws: WebSocket;
    state: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.CLOSED);

    constructor() {
    }

    public initWs(userId, lat, lng) {
        this.ws = new WebSocket(`${this.url}?user_id=${userId}&lat=${lat}&lng=${lng}`);
        this.state.next(this.ws.readyState);
        this.onMessageHandler();
        setInterval(() => {
            this.send('ping', '');
        }, 23000);
    }

    public send(action, data) {
        this.ws.send(this.prepareMessage(action, data));
    }

    private prepareMessage(action, data) {
        return JSON.stringify({
            action: action,
            data: data
        });
    }

    onMessageHandler() {
        this.ws.addEventListener('message', (event) => this.onMessage(event));
    }

    private onMessage(event) {
        this.statusHandler(event.data);
    }

    private statusHandler(message) {
        message = JSON.parse(message);
        if (message.status === 'success') {
            this.successHandler(message.data);
        } else if (message.status === 'error') {
            this.errorHandler(message.data);
        }
    }

    private successHandler(message) {
        console.log(message);
    }

    private errorHandler(message) {
        console.log(message);
    }


}
