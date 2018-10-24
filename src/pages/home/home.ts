import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  $isGeolocationActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  $locations: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(public navCtrl: NavController, private backgroundGeolocation: BackgroundGeolocation, public plt: Platform) {

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 0,
      stationaryRadius: 0,
      distanceFilter: 1,
      interval: 2000,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    };

    this.backgroundGeolocation.configure(config)
    .subscribe((location: BackgroundGeolocationResponse) => {


      this.$locations.next([...this.$locations.getValue(), location]);

      console.log(location);

      // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
      // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
      // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.

      if(plt.is('ios')) this.backgroundGeolocation.finish(); // FOR IOS ONLY

    });
    this.$isGeolocationActive.subscribe((value) => {
      if(value) {
        this.startBackgroundGeolocation();
      } else {
        this.stopBackgroundGeolocation();
      }
    })
  }

  toggleBacgroundGeolocation() {
    this.$isGeolocationActive.next(!this.$isGeolocationActive.getValue());
  }

  startBackgroundGeolocation() {
    this.$locations.next([]);
    this.backgroundGeolocation.start();
  }

  stopBackgroundGeolocation() {
    this.backgroundGeolocation.stop();
  }

}
