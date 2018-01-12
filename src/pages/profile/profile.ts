import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ViewController, ModalController, AlertController, LoadingController, Loading} from 'ionic-angular';

//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { WelcomePage } from '../welcome/welcome';
import { HomePage } from '../home/home';
import { ReceiveCoinsPage } from '../receive-coins/receive-coins';

import { AuthProvider } from '../../providers/auth/auth';
import { ContextProvider} from '../../providers/context/context';

import { ImageLoaderConfig } from 'ionic-image-loader';

import { EthapiProvider } from '../../providers/ethapi/ethapi';

import { ActionSheetController } from 'ionic-angular'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { PhoneValidator } from '../../validators/phone';

import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public loading:Loading;

  info: string;
  address: string;
  modifying: boolean = false;

  public infoForm: FormGroup;

  discAlertTitle: string;
  discAlertConfirm: string;
  discAlertCancel: string;

  saveAlertTitle: string;
  saveAlertContent: string;

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    //private nativePageTransitions: NativePageTransitions,
    public authProvider: AuthProvider,
    public ctx: ContextProvider,
    public ethapiProvider: EthapiProvider,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private translateService: TranslateService
  ) {

    this.info = this.ctx.info;
    this.address = this.ctx.getAddress();

    console.log('My profile address : ', this.address);

    this.infoForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      phone: ['', Validators.compose([PhoneValidator.isValid])]
      //password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

    this.translate();

  }

  translate() {
    this.translateService.get('PROFILE.DISCALERT.TITLE').subscribe(alertTitle => { this.discAlertTitle = alertTitle.toString(); });
    this.translateService.get('PROFILE.DISCALERT.CONFIRM').subscribe(alertConfirm => { this.discAlertConfirm = alertConfirm.toString(); });
    this.translateService.get('PROFILE.DISCALERT.CANCEL').subscribe(alertCancel => { this.discAlertCancel = alertCancel.toString(); });

    this.translateService.get('PROFILE.SAVEALERT.TITLE').subscribe(alertTitle => { this.saveAlertTitle = alertTitle.toString(); });
    this.translateService.get('PROFILE.SAVEALERT.CONTENT').subscribe(alertContent => { this.saveAlertContent = alertContent.toString(); });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  changeImage() {

  }

  disconnect() {
      let actionSheet = this.actionSheetCtrl.create({
        title: this.discAlertTitle,
        buttons: [
          {
            text: this.discAlertConfirm,
            role: 'destructive',
            handler: () => {
              console.log('text: Disconnect clicked');
              this.logOut();
            }
          },
          {
            text: this.discAlertCancel,
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });

      actionSheet.present();

  }

  logOut(): void {
    console.log('Open logOut');
    //let data = { 'disconnect': 'yes'};
    this.viewCtrl.dismiss();
    this.authProvider.logoutUser().then(() => {
      console.log('Go to WelcomePage');
      this.appCtrl.getActiveNavs()[0].insert(0,WelcomePage);
      // this.appCtrl.getRootNav().insert(0,WelcomePage);
      this.navCtrl.popToRoot();
    });
    console.log('Close logOut');
  }

  goBack() {
    //let data = { 'disconnect': 'no'};
    //this.viewCtrl.dismiss(data);
    this.viewCtrl.dismiss();
  }

  modify() {
    this.modifying = true;
  }

  saveModification() {
    this.modifying = false;

    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();

    this.ctx.save().then(
      () => {
        this.loading.dismiss();
        this.presentAlert();
      }
    );
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: this.saveAlertTitle,
      subTitle: this.saveAlertContent,
      buttons: ['Ok']
    });
    alert.present();
  }

  showID() {
    let myModalCtrl = this.modalCtrl.create(ReceiveCoinsPage, {
      coinColor : this.ctx.fidOrange
    });
    myModalCtrl.present();
  }

}
