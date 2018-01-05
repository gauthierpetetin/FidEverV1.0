import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';

import { ImageLoaderConfig, ImageLoader } from 'ionic-image-loader';

import { AuthProvider } from '../../providers/auth/auth';
import { ContextProvider} from '../../providers/context/context';
import { WalletProvider} from '../../providers/wallet/wallet';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import {Md5} from 'ts-md5/dist/md5';

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
    public walletProvider: WalletProvider,
    private uniqueDeviceID: UniqueDeviceID
  ) {
    this.imageLoaderConfig.enableSpinner(true);

    this.ctx.clear();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  startWithoutAccount() {
    var self = this;
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        console.log('UUID : ',uuid);
        self.signupUserWithUUID(uuid);
      })
      .catch((error: any) => {
        console.log('UUID error : ',error);
        if( error == 'cordova_not_available') {
          //let artificialuuid = Math.floor(Math.random() * 1000000000) + 1;
          let artificialuuid = '342735142';
          console.log('Artificial UUID: ', artificialuuid );
          self.signupUserWithUUID(artificialuuid.toString());
        }
    });

  }

  startWithAccount() {
    this.nav.push(LoginPage);
  }


  signupUserWithUUID(uuid: string){
    console.log('Open signupUserWithUUID : ', uuid);
    let password : string = Md5.hashStr('uuid').toString();
    console.log('Password : ', password);
    if (!uuid){
      console.log('Signup uuid not valid : ',uuid);
    } else {
      let signupEmail = uuid.concat('@fidever.com');
      this.ctx.setEmail(signupEmail);
      this.ctx.save();
      this.authData.signupUser(signupEmail, password).then(() => {
        console.log('Firebase signup success');
        this.walletProvider.createGlobalEthWallet().then( () => {
          this.loading.dismiss().then( () => {
            this.nav.insert(0,HomePage);
            this.nav.popToRoot();
            this.ctx.init(false);
          });
        }, (globalWalletError) => {
          console.log('Global EthWallet creation error : ', globalWalletError);
          var errorMessage: string = globalWalletError.message;
            let alert = this.alertCtrl.create({
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

      }, (authenticationError) => {
        console.log('Signup error on Firestore authenticator : ',authenticationError);
        this.loading.dismiss().then( () => {
          var errorMessage: string = authenticationError.message;
            let alert = this.alertCtrl.create({
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

}
