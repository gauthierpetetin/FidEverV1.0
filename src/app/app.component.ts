import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

//import { SplashScreen } from '@ionic-native/splash-screen';
//import { StatusBar } from '@ionic-native/status-bar';

import { ContextProvider} from '../providers/context/context';


/**************Modules**************************/
import { AngularFireAuth } from 'angularfire2/auth';
//import { AuthProvider } from '../providers/auth/auth';

/**************Pages****************************/
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';


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
    //authData: AuthProvider,
    ctx: ContextProvider
    //private imageLoaderConfig: ImageLoaderConfig
    //private splashScreen: SplashScreen,
    //private statusBar: StatusBar
  ){


    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        console.log('userID : ', user.uid);
        ctx.init().then( (ethAccountFound) => {
          if(ethAccountFound) {
            console.log('Context init success with Eth account');
            this.goToHomePage(authObserver);
          }
          else {
            console.log('Context init success without Eth account');
            this.goToWelcomePage(ctx, authObserver);
          }

        }, (err) => {
          console.log('Context init error : ', err);
          this.goToWelcomePage(ctx, authObserver);
        });;

      } else {
        this.goToWelcomePage(ctx, authObserver);
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

  goToHomePage(obs: any) {
    this.rootPage = HomePage;
    obs.unsubscribe();
  }

  goToWelcomePage(ctx: any, obs: any) {
    ctx.clear();
    this.rootPage = WelcomePage;
    obs.unsubscribe();
  }

}
