import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

//import { SplashScreen } from '@ionic-native/splash-screen';
//import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateService } from '@ngx-translate/core';

/**************Providers************************/
import { ContextProvider} from '../providers/context/context';
import { AuthProvider } from '../providers/auth/auth';


/**************Modules**************************/
import { AngularFireAuth } from 'angularfire2/auth';
//import { AuthProvider } from '../providers/auth/auth';

/**************Pages****************************/
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { UpdatePage } from '../pages/update/update';

import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';


import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { Globalization } from '@ionic-native/globalization';

import { UniqueDeviceID } from '@ionic-native/unique-device-id';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  appVersion: number = 1.1;

  rootPage:any;

  constructor(
    platform: Platform,
    afAuth: AngularFireAuth,
    authData: AuthProvider,
    public ctx: ContextProvider,
    //private splashScreen: SplashScreen,
    //private statusBar: StatusBar
    translateService: TranslateService,
    private screenOrientation: ScreenOrientation,
    private firebaseAnalytics: FirebaseAnalytics,
    private push: Push,
    private globalization: Globalization,
    private uniqueDeviceID: UniqueDeviceID
  ){

    var self = this;

    /**********Uncomment this line to set app to production********************/
    //this.ctx.setAppToProduction();
    /**********Uncomment this line to set app to production********************/

    ctx.setMyAppVersion(this.appVersion);


    // let testArray: any = [];
    // let struct1: any = {
    //   test1: 'test1',
    //   bool: true
    // }
    // testArray.push(struct1);
    // let struct2: any = {
    //   test1: 'test2',
    //   bool: true
    // }
    // testArray.push(struct2);
    // let struct3: any = {
    //   test1: 'test3',
    //   bool: true
    // }
    // testArray.push(struct3);
    // console.log('TestArray : ', testArray);
    // console.log('Pop : ', testArray.pop());
    // console.log('TestArray (pop) : ', testArray);


    const authObserver = afAuth.authState.subscribe( user => {

      if (user) {
        console.log('userID : ', user.uid);
        console.log('userEmail : ', user.email);
        console.log('userDisplayName : ', user.displayName);
        console.log('photoURL : ', user.photoURL);

        ctx.init(user.uid, user.email, user.displayName, user.photoURL, true, true, false).then( (res) => {
          console.log('Context init success : ', res);
          this.goToHomePage(authObserver);
        }, (err) => {
          console.log('Context init error : ', err);
          if(err == ctx.getUpdateString() ){
            console.log('UPDATE');
            this.goToUpdatePage(ctx, authObserver);
          }
          else{
            // console.log('NO UPDATE');
            this.goToWelcomePage(ctx, authObserver);
          }
        });

      } else {
        console.log('AuthState subscription error');
        this.goToWelcomePage(ctx, authObserver);
      }
    });

    translateService.addLangs(["en", "fr", "es"]);
    translateService.setDefaultLang('en');


    // let language = 'fr';
    // translateService.use(language);
    // ctx.setLanguage(language);



    platform.ready().then(() => {

      this.uniqueDeviceID.get().then((deviceId: any) => {
        this.ctx.deviceId = deviceId;
      }).catch((error: any) => {
        console.log('No deviceId');
        if(!this.ctx.getProductionApp()) {
          let artificialDeviceId = 'xxxxxxxxxx';
          this.ctx.deviceId = artificialDeviceId;
        }
      });

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



				if ((<any>window).cordova ) {
					this.globalization.getPreferredLanguage().then(result => {
						var language = result.value;
            language = language.substring(0, 2).toLowerCase();
            if(language == 'fr') {
              translateService.use(language);
              this.ctx.setLanguage(language);
              authData.setLanguage(language);
            }
					});
				}


        if( !this.ctx.getProductionApp() ) {
          translateService.use('fr');
          this.ctx.setLanguage('fr');
          authData.setLanguage('fr');
        }



    });
  }

  // getSuitableLanguage(language) {
	// 	language = language.substring(0, 2).toLowerCase();
	// 	return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
	// }


  goToHomePage(obs: any) {
    this.rootPage = HomePage;
    obs.unsubscribe();
  }

  goToWelcomePage(ctx: any, obs: any) {
    ctx.clear();
    this.rootPage = WelcomePage;
    obs.unsubscribe();
  }

  goToUpdatePage(ctx: any, obs: any) {
    ctx.clear();
    this.rootPage = UpdatePage;
    obs.unsubscribe();
  }

}
