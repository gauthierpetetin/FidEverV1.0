import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';

import { ImageLoaderConfig, ImageLoader } from 'ionic-image-loader';

import { AuthProvider } from '../../providers/auth/auth';
import { ContextProvider} from '../../providers/context/context';
import { WalletProvider} from '../../providers/wallet/wallet';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

import {Md5} from 'ts-md5/dist/md5';

// import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the WelcomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  public loading: Loading;

  constructor(
    public nav: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public authData: AuthProvider,
    private imageLoaderConfig: ImageLoaderConfig,
    public imageLoader: ImageLoader,
    public ctx: ContextProvider,
    public walletProvider: WalletProvider
  ) {
    this.imageLoaderConfig.enableSpinner(true);

    this.ctx.clear();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  startWithoutAccount() {
    let deviceId = this.ctx.getDeviceId();
    console.log('Open startWithoutAccount : ', deviceId);
    this.signupUserWithUUID(deviceId);
  }

  startWithAccount() {
    this.nav.push(LoginPage);
  }


  signupUserWithUUID(uuid: string){
    console.log('Open signupUserWithUUID : ', uuid);
    let hashPassword : string = Md5.hashStr(uuid).toString();
    if (!uuid){
      console.log('Signup uuid not valid : ',uuid);
    } else {
      let signupEmail = uuid.concat('@fidever.com');
      // this.ctx.setEmail(signupEmail);
      // this.ctx.save();
      var self = this;
      this.fakeSignupUser(signupEmail, hashPassword).then( (user) => {
        self.nav.insert(0,HomePage);
        self.nav.popToRoot();
        self.ctx.init(user.uid, user.email, user.displayName, user.photoURL, true, true, false);
      }).catch( () => {
        self.loading.dismiss().then( (err) => {
          var errorMessage: string = "Error ".concat(err);
            let alert = self.alertCtrl.create({
              message: errorMessage,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
        });

      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }

    console.log('Close signupUser');
  }

  fakeSignupUser(signupEmail: string, hashPassword: string): Promise<any> {
    console.log('Open fakeSignupUser');
    var self = this;
    return new Promise((resolve, reject) => {
      self.authData.signupUser(signupEmail, hashPassword).then((user) => {
        console.log('Firebase signup success : ', user.uid);
        self.walletProvider.createGlobalEthWallet(user.uid, user.email, user.displayName, user.profilePicture, hashPassword).then( () => {
          self.loading.dismiss().then( () => {
            resolve(user);
          });
        }, (globalWalletError) => {
          reject(globalWalletError);
        });

      }, (authenticationError) => {
        self.fakeLoginUser(signupEmail, hashPassword).then( (user) => {
          resolve(user);
        }).catch( (err) => {
          reject(err);
        });

      });

    });

  }

  fakeLoginUser(loginEmail: string, hashPassword: string){
    console.log('Open fakeLoginUser');
    var self = this;
    return new Promise((resolve, reject) => {
      this.authData.loginUser(loginEmail, hashPassword).then((user) => {
        console.log('Firebase login success : ', user.uid);
        self.walletProvider.createGlobalEthWallet(user.uid, user.email, user.displayName, user.profilePicture, hashPassword).then( () => {
          self.loading.dismiss().then( () => {
            resolve(user);
          });

        }, (globalWalletError) => {
          reject(globalWalletError);
        });

      }, (authenticationError) => {
        reject(authenticationError);
      });
    });
  }

}
