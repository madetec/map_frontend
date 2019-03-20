import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../@core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  signInForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  onSubmit() {
    // this.authService.login('madetec', '1qazxsw23edc', 'testclient', 'testpass').subscribe((data) => {
    //   console.log(data);
    // });
    this.router.navigate(['/main-map']);
  }

}
