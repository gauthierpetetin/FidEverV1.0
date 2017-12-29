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

import { EthapiProvider } from '../../providers/ethapi/ethapi';
import { Storage } from '@ionic/storage';

import { ContextProvider} from '../../providers/context/context';
import { FidapiProvider } from '../../providers/fidapi/fidapi';

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

  //HTTPREQUEST
  //requestAnswer: Observable<any>;

  constructor(
    public nav: NavController,
    public authData: AuthProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public ethapiProvider: EthapiProvider,
    private storage: Storage,
    // public http: Http,
    public ctx: ContextProvider,
    public fidapiProvider: FidapiProvider

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
      this.ctx.setEmail(this.signupForm.value.email);
      this.ctx.save();
      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then(() => {
        console.log('Signup success on Firestore authenticator');
        this.createEthWallet().then( () => {
          this.nav.setRoot(HomePage);
        }, (walletError) => {
          console.log('createNewEthWallet error : ', walletError);
          var errorMessage: string = walletError.message;
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

  createEthWallet():Promise <any> {
    return new Promise((resolve,reject) => {

      //Ethereum account creation
      this.initEthWalletLocally().then( (nAddress) => {
        console.log('Wallet creation success : ', nAddress);
        this.fidapiProvider.createWallet(nAddress).then( () => {
          console.log('Signup success on Firestore database');
          this.loading.dismiss().then( () => {
            resolve();
          });
        }, (fidAPIError) => {
          console.log('Signup error on Firestore database : ', fidAPIError);
          reject(fidAPIError);
        }
        );
      }, (ethAPIError) => {
        console.log('Wallet creation error : ', ethAPIError);
        reject(ethAPIError);
        });
      //End of Ethereum account creation

    });

  }



  initEthWalletLocally():Promise <any> {
  console.log('Open initEthereumAccount');
    var ethAccount: {
      address: string,
      privateKey : string
    };

    var self = this;
    return new Promise((resolve,reject) => {
      // create Ethereum address + private key couple
      ethAccount = self.ethapiProvider.createAccount();
      console.log('Ethereum IDs created: '.concat(JSON.stringify(ethAccount)));

      self.ctx.setAddress(ethAccount.address);
      self.ctx.setPrivateKey(ethAccount.privateKey);

      // set the Ethereum IDs in the device
      self.ctx.save().then( () => {
        console.log('Ethereum IDs stored in storage');
        resolve(ethAccount.address);
        }, (error) => {
          console.log('Error saving EthAccount in storage');
          reject(error);
        }
      );

    });

  }

}
