import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.page.html',
  styleUrls: ['./main-map.page.scss'],
})
export class MainMapPage implements OnInit {

  constructor(private geolocation: Geolocation) { }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp.coords);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
       console.log(data);
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
     });
  }

}
