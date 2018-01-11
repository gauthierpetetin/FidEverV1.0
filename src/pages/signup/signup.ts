import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  LoadingController,
  Loading,
  AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { EmailValidator } from '../../validators/email';

//import { EthapiProvider } from '../../providers/ethapi/ethapi';
import { Storage } from '@ionic/storage';

import { ContextProvider} from '../../providers/context/context';
import { WalletProvider} from '../../providers/wallet/wallet';
//import { FidapiProvider } from '../../providers/fidapi/fidapi';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm: FormGroup;
  public loading: Loading;

  info : string;

  address : string;
  privateKey : string;

  constructor(
    public nav: NavController,
    public authData: AuthProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private storage: Storage,
    public ctx: ContextProvider,
    public walletProvider: WalletProvider

  ) {

    this.info = this.ctx.info;

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }


  /**
   * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  signupUser(){
    console.log('Open signupUser');
    if (!this.signupForm.valid){
      console.log('Signup form not valid : ',this.signupForm.value);
    } else {
      let signupEmail: string = this.signupForm.value.email;
      let password: string = this.signupForm.value.password;
      this.ctx.setEmail(signupEmail);
      this.ctx.save();
      this.authData.signupUser(signupEmail, password).then((user) => {
        console.log('Firebase signup success : ', user.uid);
        this.walletProvider.createGlobalEthWallet(user.uid, password).then( () => {
          this.loading.dismiss().then( () => {
            this.nav.insert(0,HomePage);
            this.nav.popToRoot();
            this.ctx.init(user.uid, true, true, false);
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
          this.loading.dismiss();
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
          this.loading.dismiss();
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
