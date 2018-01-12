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

import { Globalization } from '@ionic-native/globalization';
// import { defaultLanguage, availableLanguages, sysOptions } from './i18n-demo.constants';


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
    translateService: TranslateService,
    private screenOrientation: ScreenOrientation,
    private firebaseAnalytics: FirebaseAnalytics,
    private push: Push,
    private globalization: Globalization
  ){

    var self = this;

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



      // this language will be used as a fallback when a translation isn't found in the current language
				//translate.setDefaultLang(defaultLanguage);

				if ((<any>window).cordova) {
					this.globalization.getPreferredLanguage().then(result => {
						var language = result.value;
            language = language.substring(0, 2).toLowerCase();
            if(language == 'fr') {
              console.log('FRAAAAANCAIS');
              translateService.use('fr');
              this.ctx.setLanguage('fr');
            }

						//translate.use(language);
						// sysOptions.systemLanguage = language;
					});
				} else {
          console.log('AAAAANGLAIS');
					// let browserLanguage = translate.getBrowserLang() || defaultLanguage;
					// var language = this.getSuitableLanguage(browserLanguage);
					// //translate.use(language);
					// sysOptions.systemLanguage = language;
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

}
