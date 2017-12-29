import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  LoadingController,
  Loading,
  AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

import { ContextProvider} from '../../providers/context/context';
import { EthapiProvider } from '../../providers/ethapi/ethapi';
import { FidapiProvider } from '../../providers/fidapi/fidapi';

//
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { ResetPasswordPage } from '../reset-password/reset-password';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public loginForm:FormGroup;
  public loading:Loading;

  info : string;

  constructor(
    public navCtrl: NavController,
    public authData: AuthProvider,
    public ethapiProvider: EthapiProvider,
    public fidapiProvider: FidapiProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public ctx: ContextProvider
  ) {

      console.log('Login Page constructor');

      this.info = this.ctx.info;

      this.ctx.clear();

      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
    }

    loginUser(){
      if (!this.loginForm.valid){
        console.log(this.loginForm.value);
      }
      else {
        this.ctx.c[this.info]['email']=this.loginForm.value.email;
        this.ctx.save();
        this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
          this.createEthWallet().then( () => {
            console.log("go to HomePage");
            this.navCtrl.setRoot(HomePage);
            this.ctx.init();
          });

        }, error => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: error.message,
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
  }

  goToResetPassword(){
    this.navCtrl.push(ResetPasswordPage);
  }

  createAccount(){
    this.navCtrl.push(SignupPage);
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
