import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../@core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  signInForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private menuCtrl: MenuController) { }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  onSubmit() {
    this.authService.login(this.signInForm.controls.username.value, this.signInForm.controls.password.value, 'testclient', 'testpass').subscribe((data) => {
      this.authService.getUserRole().subscribe(res => {
        if(res.role === 'user') {
          this.router.navigate(['/main-user']);
        } else if(res.role === 'driver') {
          this.router.navigate(['/main-driver']);
        }
      });
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

}
