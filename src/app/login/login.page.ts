import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MenuController} from '@ionic/angular';
import {AuthService} from '../@core/services/auth.service';
import {Network} from '@ionic-native/network/ngx';


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
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private menuCtrl: MenuController,
        private network: Network) {
    }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
    this.authService.onLoginIncorrect.subscribe(res => {
      this.hasError = true;
        this.errMsg = 'Неверный логин или пароль';
    });
  }

  onSubmit() {
      if (this.hasError = this.isEmpty(this.signInForm.controls.username.value, this.signInForm.controls.password.value)) {
          this.errMsg = 'Поля не должны быть пустыми';
      } else {
          this.disabled = true;
          this.authService.login(this.signInForm.controls.username.value, this.signInForm.controls.password.value, 'testclient', 'testpass').subscribe((data) => {
              this.authService.getUserRole().subscribe(res => {
                  if (res.role === 'user') {
                      this.authService.setFirebaseToken();
                      this.router.navigate(['/main-user']);
                  } else if (res.role === 'driver') {
                      this.authService.setFirebaseToken();
                      this.router.navigate(['/main-driver']);
                  }
              });
          });
          this.disabled = false;
      }
  }

    isEmpty(username, password) {
        return (!username && !password) || (!username) || (!password);
    }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

}
