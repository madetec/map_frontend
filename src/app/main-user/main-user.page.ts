import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MenuController } from '@ionic/angular';
declare var google: any;

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.page.html',
  styleUrls: ['./main-user.page.scss']
})
export class MainUserPage implements OnInit {
  @ViewChild('Map') mapElement: ElementRef;
  map: any;
  mapOptions: any;
  location = {lat: 41.310997, lng: 69.277880};
  markerOptions: any = {position: null, map: null, title: null};
  marker: any;
  apiKey: any = 'AIzaSyDHLzW7e35n33f2pVHwRl790N9Uv-SIZv4'; /*Your API Key*/

  constructor(public zone: NgZone, public geolocation: Geolocation, private menuCtrl: MenuController) {
    const script = document.createElement('script');
      script.id = 'googleMap';
      if (this.apiKey) {
          script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey;
      } else {
          script.src = 'https://maps.googleapis.com/maps/api/js?key=';
      }
      document.head.appendChild(script);
  }
  ngOnInit() {
      /*Get Current location*/
      this.geolocation.getCurrentPosition().then((position) =>  {
          this.location.lat = position.coords.latitude;
          this.location.lng = position.coords.longitude;
        });
      // this.location.lat = 41.310997;
      // this.location.lng = 69.277880;
      /*Map options*/
      this.mapOptions = {
          center: this.location,
          zoom: 16,
          mapTypeControl: false,
          disableDefaultUI: true
      };
      setTimeout(() => {
          this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
          /*Marker Options*/
          this.markerOptions.position = this.location;
          this.markerOptions.map = this.map;
          this.markerOptions.title = 'My Location';
          this.marker = new google.maps.Marker(this.markerOptions);
      }, 3000);
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

}
