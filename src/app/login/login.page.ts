import {Component, OnInit} from '@angular/core';
import {MenuController, Platform} from '@ionic/angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Network} from '@ionic-native/network/ngx';
import {AuthenticationService} from '../@core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
    signInForm: FormGroup;
    hasError: boolean = false;
    errMsg: string;
    disabled: boolean = false;
    constructor(
        private authenticationService: AuthenticationService,
        private formBuilder: FormBuilder,
        private router: Router,
        private menuCtrl: MenuController,
        private network: Network,
        private platform: Platform
    ) {
    }

  ngOnInit() {

      this.signInForm = this.formBuilder.group({
          username: [''],
          password: ['']
      });
      this.authenticationService.onLoginIncorrect.subscribe(res => {
          this.hasError = true;
          this.errMsg = 'Неверный логин или пароль';
          this.disabled = false;
      });
  }

    onSubmit() {
        if (this.hasError = this.isEmpty(this.signInForm.controls.username.value, this.signInForm.controls.password.value)) {
            this.errMsg = 'Поля не должны быть пустыми';
        } else {
            this.disabled = true;
            this.authenticationService.login(
                this.signInForm.controls.username.value,
                this.signInForm.controls.password.value
            );
            this.disabled = false;
        }
    }

    logout() {
        this.authenticationService.logout();
    }

    isEmpty(username, password) {
        return (!username && !password) || (!username) || (!password);
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(false);
        this.signInForm.reset();
    }

    isSmartPhone() {
        return this.platform.is('ios') || this.platform.is('android');
    }
}
