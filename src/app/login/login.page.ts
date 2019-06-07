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
    hasError = false;
    errMsg: string;
    disabled = false;
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
          this.errMsg = res;
          this.disabled = false;
      });
  }

    onSubmit() {
        if (this.hasError = this.isEmpty(this.signInForm.controls.username.value, this.signInForm.controls.password.value)) {
            this.errMsg = 'Поля не должны быть пустыми';
            this.disabled = false;
        } else {
            this.disabled = true;
            const response = this.authenticationService.login(
                this.signInForm.controls.username.value,
                this.signInForm.controls.password.value
            );
            if (response.closed) {
                this.disabled = false;
            }
        }
    }

    isEmpty(username, password) {
        return (!username && !password) || (!username) || (!password);
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(false);
        this.signInForm.reset();
    }
    ionViewWillLeave() {
        this.disabled = false;
    }

    isSmartPhone() {
        return this.platform.is('ios') || this.platform.is('android');
    }
}
