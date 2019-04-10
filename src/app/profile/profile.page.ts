import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'profile-user',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
    public fullName: string;
    public username: string;
    public name: string;
    public last_name: string;
    public father_name: string;
    public subdivision: string;
    public position: string;
    public main_phone: string;
    public main_address: string;
    public phones: string[];
    public addresses: string[];
    public status = {};

    constructor() {
    }

    ngOnInit() {
        // подправить дизайн по шаблону
        // проверить за логинен ли пользователь
        // запрос GET с Authorization: Bearer token -> на http://api.telecom-car.uz/user/profile
        this.name = "Ziyodilla";
        this.last_name = "Mirxanov";
        this.father_name = "Saparovich";
        this.fullName = `${this.last_name} ${this.name} ${this.father_name}`;
        this.username = "username";
        this.subdivision = "Центр 'Ахборот тизимлари'";
        this.position = "Инженер первой категории";
        this.main_phone = "998717787";
        this.main_address = "ул. А. Хидоятова, 109 дом";
    }
}
