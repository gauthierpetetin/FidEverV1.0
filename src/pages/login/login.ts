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
          console.log("go to HomePage");
          this.navCtrl.setRoot(HomePage);
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

}
