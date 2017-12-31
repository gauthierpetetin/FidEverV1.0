import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

//import { SplashScreen } from '@ionic-native/splash-screen';
//import { StatusBar } from '@ionic-native/status-bar';

import { ContextProvider} from '../providers/context/context';


/**************Modules**************************/
import { AngularFireAuth } from 'angularfire2/auth';


/**************Pages****************************/
import { HomePage } from '../pages/home/home';


/**************Others***************************/
//import { ImageLoaderConfig } from 'ionic-image-loader';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform,
    afAuth: AngularFireAuth,
    ctx: ContextProvider
    //private imageLoaderConfig: ImageLoaderConfig
    //private splashScreen: SplashScreen,
    //private statusBar: StatusBar
  ){


    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        ctx.init().then( (ethAccountFound) => {
          if(ethAccountFound) {
            console.log('Context init success with Eth account');
            this.rootPage = HomePage;
            authObserver.unsubscribe();
          }
          else {
            console.log('Context init success without Eth account');
            ctx.clear();
            this.rootPage = 'LoginPage';
            authObserver.unsubscribe();
          }

        }, (err) => {
          console.log('Context init error : ', err);
          ctx.clear();
          this.rootPage = 'LoginPage';
          authObserver.unsubscribe();
        });;

      } else {
        this.rootPage = 'LoginPage';
        authObserver.unsubscribe();
      }
    });


    //imageLoaderConfig.enableSpinner(false);
    //imageLoaderConfig.setConcurrency(10);

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      //statusBar.backgroundColorByHexString('#fe9400');
      //statusBar.hide();

      //splashScreen.hide();
    });
  }

}
