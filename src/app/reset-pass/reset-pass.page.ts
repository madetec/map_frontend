import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {

  resetForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private menuCtrl: MenuController) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      code: ['']
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

}
