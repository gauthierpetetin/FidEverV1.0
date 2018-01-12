import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

//import { SplashScreen } from '@ionic-native/splash-screen';
//import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateService } from '@ngx-translate/core';

/**************Providers************************/
import { ContextProvider} from '../providers/context/context';


/**************Modules**************************/
import { AngularFireAuth } from 'angularfire2/auth';
//import { AuthProvider } from '../providers/auth/auth';

/**************Pages****************************/
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';

import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';


import { Push, PushObject, PushOptions } from '@ionic-native/push';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform,
    afAuth: AngularFireAuth,
    public ctx: ContextProvider,
    //private splashScreen: SplashScreen,
    //private statusBar: StatusBar
    private translateService: TranslateService,
    private screenOrientation: ScreenOrientation,
    private firebaseAnalytics: FirebaseAnalytics,
    private push: Push
  ){


    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        console.log('userID : ', user.uid);

        ctx.init(user.uid, true, true, false).then( (ethAccountFound) => {
          console.log('Context init success : ', ethAccountFound);
          this.goToHomePage(authObserver);
        }, (err) => {
          console.log('Context init error : ', err);
          ctx.clear();
          this.goToWelcomePage(ctx, authObserver);
        });

      } else {
        console.log('AuthState subscription error');
        ctx.clear();
        this.goToWelcomePage(ctx, authObserver);
      }
    });

    translateService.addLangs(["en", "fr", "es"]);
    translateService.setDefaultLang('en');

    this.launchLanguage('fr');

    // let language = 'fr';
    // translateService.use(language);
    // ctx.setLanguage(language);



    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      //statusBar.backgroundColorByHexString('#fe9400');
      //statusBar.hide();
      //splashScreen.hide();
      if (platform.is('cordova')) {
        console.log('Cordova platform');
        ctx.cordovaPlatform = true;
        // set to landscape
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

        this.firebaseAnalytics.logEvent('FidEver_opended', {page: "FidEver_components"})
          .then((res: any) => console.log('FidEver_opended event logged on Firebase : ', res))
          .catch((error: any) => console.error(error)
        );

        // to check if we have permission
        this.push.hasPermission().then((res: any) => {
          if (res.isEnabled) {
            console.log('We have permission to send push notifications');
          } else {
            console.log('We do not have permission to send push notifications');
          }
        });

      }
      else{
        ctx.cordovaPlatform = false;
        console.log('Not a cordova platform');
      }




    });
  }

  launchLanguage(language: string) {
    this.translateService.use(language);
    this.ctx.setLanguage(language);
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
