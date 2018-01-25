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
import { FirestoreProvider } from '../../providers/firestore/firestore';

import { ActionSheetController } from 'ionic-angular'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { PhoneValidator } from '../../validators/phone';

import { TranslateService } from '@ngx-translate/core';

import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
// import { Platform } from 'ionic-angular';

import {Md5} from 'ts-md5/dist/md5';


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

  demoMode: boolean = false;

  public infoForm: FormGroup;
  public signupForm: FormGroup;

  discAlertTitle: string;
  discAlertConfirm: string;
  discAlertCancel: string;

  saveAlertTitle1: string;
  saveAlertContent1: string;

  saveAlertTitle2: string;
  saveAlertContent2: string;

  name: string;
  email: string;
  profilePicture: string;
  profilePictureData: string;

  newName: string;
  newEmail: string;
  newProfilePicture: string;

  accountCreated: boolean;
  newAccountMode: boolean;

  emailPlaceholder: string;
  passwordPlaceholder: string;

  emailAlertTitle: string; // "Error"
  emailAlertContent: string; // "Please enter a valid email."

  signupAlertTitle1: string; // "Congratulations"
  signupAlertContent1: string; // "Account created successfully."
  signupAlertTitle2: string; // "Error"
  signupAlertContent2: string; // "Account creation error."

  constructor(
    // public platform: Platform,
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public authProvider: AuthProvider,
    public ctx: ContextProvider,
    public ethapiProvider: EthapiProvider,
    public firestoreProvider: FirestoreProvider,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private translateService: TranslateService,
    private imagePicker: ImagePicker,
    private camera: Camera
  ) {

    this.info = this.ctx.info;

    this.demoMode = this.ctx.getDemoMode();

    this.infoForm = formBuilder.group({
      name: ['', ],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      //phone: ['', Validators.compose([PhoneValidator.isValid])]
      //password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

    this.getAccountInfo();

    this.checkIfAccountCreated(this.ctx.getEmail(), this.ctx.getHashPassword());

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

    this.translate();

    // this.logOut();

  }

  checkIfAccountCreated(email: string, hashPassword: string) {
    let emailDomain = email.substr(email.length - 12);
    let theoreticalHashPassword = Md5.hashStr(this.ctx.getDeviceId()).toString();
    if ( (emailDomain == "@fidever.com") || (hashPassword == theoreticalHashPassword) ) {
      console.log('FidEver domain');
      this.accountCreated = false;
    }
    else {
      this.accountCreated = true;
    }
    /*******************************/
    // this.accountCreated = true;
    /*******************************/
  }

  getAccountInfo() {
    this.name = this.ctx.getName();
    this.email = this.ctx.getEmail();
    this.profilePicture = this.ctx.getProfilePicture();

    this.address = this.ctx.getAddress();

  }

  translate() {
    this.translateService.get('PROFILE.DISCALERT.TITLE').subscribe(alertTitle => { this.discAlertTitle = alertTitle.toString(); });
    this.translateService.get('PROFILE.DISCALERT.CONFIRM').subscribe(alertConfirm => { this.discAlertConfirm = alertConfirm.toString(); });
    this.translateService.get('PROFILE.DISCALERT.CANCEL').subscribe(alertCancel => { this.discAlertCancel = alertCancel.toString(); });

    this.translateService.get('PROFILE.SAVEALERT.TITLE1').subscribe(alertTitle => { this.saveAlertTitle1 = alertTitle.toString(); });
    this.translateService.get('PROFILE.SAVEALERT.CONTENT1').subscribe(alertContent => { this.saveAlertContent1 = alertContent.toString(); });
    this.translateService.get('PROFILE.SAVEALERT.TITLE2').subscribe(alertTitle => { this.saveAlertTitle2 = alertTitle.toString(); });
    this.translateService.get('PROFILE.SAVEALERT.CONTENT2').subscribe(alertContent => { this.saveAlertContent2 = alertContent.toString(); });

    this.translateService.get('SIGNUP.EMAIL.PLACEHOLDER').subscribe(emailPlaceholder => { this.emailPlaceholder = emailPlaceholder.toString(); });
    this.translateService.get('SIGNUP.PASSWORD.PLACEHOLDER').subscribe(passwordPlaceholder => { this.passwordPlaceholder = passwordPlaceholder.toString(); });

    this.translateService.get('PROFILE.EMAILALERT.TITLE').subscribe(emailAlertTitle => { this.emailAlertTitle = emailAlertTitle.toString(); });
    this.translateService.get('PROFILE.EMAILALERT.CONTENT').subscribe(emailAlertContent => { this.emailAlertContent = emailAlertContent.toString(); });

    this.translateService.get('PROFILE.SIGNUPALERT.TITLE1').subscribe(signupAlertTitle => { this.signupAlertTitle1 = signupAlertTitle.toString(); });
    this.translateService.get('PROFILE.SIGNUPALERT.CONTENT1').subscribe(signupAlertContent => { this.signupAlertContent1 = signupAlertContent.toString(); });
    this.translateService.get('PROFILE.SIGNUPALERT.TITLE2').subscribe(signupAlertTitle => { this.signupAlertTitle2 = signupAlertTitle.toString(); });
    this.translateService.get('PROFILE.SIGNUPALERT.CONTENT2').subscribe(signupAlertContent => { this.signupAlertContent2 = signupAlertContent.toString(); });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  // changeImage() {
  //   if (this.ctx.cordovaPlatform) {
  //     this.imagePicker.getPictures({
  //         maximumImagesCount: 1,
  //         width: 200
  //     }).then((results) => {
  //       console.log('Image URI: ' + results);
  //       this.ctx.setProfilePicture(results);
  //       this.profilePicture = this.ctx.getProfilePicture();
  //
  //     }, (err) => { });
  //   }
  //   else{
  //     /***************/
  //     this.profilePicture = "assets/images/default_images/defaultProfile.png";
  //     /***************/
  //   }
  //
  //   console.log('changeImage1 : ', this.profilePicture);
  //   console.log('changeImage2 : ', this.oldProfilePicture);
  //
  // }


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
      this.appCtrl.getRootNav().setRoot(WelcomePage);
      // this.appCtrl.getActiveNavs()[0].insert(0,WelcomePage);
      // this.appCtrl.getRootNav().insert(0,WelcomePage);
      // this.navCtrl.popToRoot();
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

    this.newName = this.name;
    this.newEmail = this.email;
    this.profilePictureData = undefined;
  }

  cancel() {
    this.modifying = false;
  }

  changeImage() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
      allowEdit: true
    }).then(imageData => {
      this.profilePictureData = imageData;
      this.newProfilePicture = "data:image/jpeg;base64," + imageData;

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();

      this.saveProfilePicture(this.newProfilePicture, this.profilePictureData).then( (updatedProfilePicture) => {
        this.ctx.setProfilePicture(updatedProfilePicture);
        this.profilePicture = updatedProfilePicture;
        this.loading.dismiss();
      }).catch( () => {
        this.loading.dismiss();
      });

    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  saveModification() {
    if (!this.infoForm.valid){
      console.log('Info form not valid : ',this.infoForm.value);
      let alert = this.alertCtrl.create({
        title: this.emailAlertTitle,
        subTitle: this.emailAlertContent,
        buttons: ['Ok']
      });
      alert.present();
    }
    else{

    this.modifying = false;

    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();

    this.authenticate().then( () => {
      this.saveEmail(this.newEmail, this.email).then( () => {
        // this.saveProfilePicture(this.profilePicture, this.profilePictureData).then( (updatedProfilePicture) => {
          this.saveProfile(this.newName, this.newProfilePicture).then( () => {
            this.ctx.save().then( () => {
              this.presentSaveSuccessAlert();
            }, () => {
              this.presentSaveErrorAlert();
            });
          }).catch( () => {
            this.presentSaveErrorAlert();
          });
        // }).catch( () => {
        //   this.presentSaveErrorAlert();
        // });
      }).catch( () => {
        this.presentSaveErrorAlert();
      });
    }).catch( () => {
      this.presentSaveErrorAlert();
    });

  }

  }

  authenticate(): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      console.log('Authenticate : ', self.ctx.getEmail(), ' ', self.ctx.getHashPassword() );
      self.authProvider.loginUser(self.ctx.getEmail(), self.ctx.getHashPassword() ).then( () => {
        console.log('Authentication success');
        resolve();
      }).catch( (err) => {
        console.log('Authentication error : ', err);
        reject();
      } );
    });
  }

  saveEmail(newEmail: string, email?: string): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      if( (email != newEmail ) || (!email) ) {
        self.authProvider.setNewEmail(newEmail).then( () => {
          console.log('New email saved successfully.');
          self.ctx.setEmail(newEmail);
          resolve();
        }).catch( (err) => {
          console.log('Save Email error : ', err);
          reject(err);
        });
      }
      else {
        resolve();
      }

    });
  }

  saveProfilePicture(profilePicture: string, profilePictureData: string): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      if (profilePictureData) {
        console.log('Save with image upload');
        self.firestoreProvider.uploadImage(profilePictureData, 'profilePictures/'.concat(self.ctx.getUid(), '.jpg') )
          .then( (success) => {
            console.log('Image uploaded with success : ', success);
            // self.profilePicture = success;
            self.ctx.setProfilePicture(success);
            resolve(success);
          })
          .catch( (err) => {
            console.log('Upload image error : ', JSON.stringify(err.json()) );
            reject();
          }
        );

      }//end if
      else {
        console.log('Save without image upload');
        resolve();
      }

    });
  }

  saveProfile(newName: string, profilePicture: string):Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      self.authProvider.setProfile(newName, profilePicture).then( () => {
        console.log('New profile saved successfully.');
        this.ctx.setName(newName);
        resolve();
      }).catch( (err) => {
        console.log('Save Email error : ', err);
        reject();
      });

    });
  }

  savePassword(newPassword: string): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      if( newPassword ) {
        self.authProvider.setNewPassword(newPassword).then( () => {
          console.log('New password saved successfully.');
          self.ctx.setHashPassword(newPassword);
          resolve();
        }).catch( (err) => {
          console.log('Save Password error : ', err);
          reject();
        });
      }
      else {
        resolve();
      }

    });
  }

  presentSaveSuccessAlert() {
    this.getAccountInfo();
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: this.saveAlertTitle1,
      subTitle: this.saveAlertContent1,
      buttons: ['Ok']
    });
    alert.present();
  }

  presentSaveErrorAlert() {
    this.getAccountInfo();
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: this.saveAlertTitle2,
      subTitle: this.saveAlertContent2,
      buttons: ['Ok']
    });
    alert.present();
  }

  presentSignupSuccessAlert() {
    this.getAccountInfo();
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: this.signupAlertTitle1,
      subTitle: this.signupAlertContent1,
      buttons: ['Ok']
    });
    alert.present();
  }

  presentSignupErrorAlert(error: any) {
    let message: string;
    if( error ) {
      message = this.signupAlertContent2.concat(' (', error.message, ')');
    }
    else {
      message = this.signupAlertContent2;
    }
    this.getAccountInfo();
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: this.signupAlertTitle2,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  showID() {
    let myModalCtrl = this.modalCtrl.create(ReceiveCoinsPage, {
      coinColor : this.ctx.fidLightGrey
    });
    myModalCtrl.present();
  }

  createNewAccount() {
    this.newAccountMode = true;
  }

  signupUser() {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    let signupEmail: string = this.signupForm.value.email;
    let hashPassword: string = Md5.hashStr(this.signupForm.value.password).toString();
    this.setEmailAndPassword(signupEmail, hashPassword).then( () => {
      this.ctx.save();
      this.checkIfAccountCreated(this.ctx.getEmail(), this.ctx.getHashPassword());
      this.presentSignupSuccessAlert();
      this.newAccountMode = false;
    }).catch( (err) => {
      console.log('signupUser error : ', err);
      this.ctx.save();
      this.checkIfAccountCreated(this.ctx.getEmail(), this.ctx.getHashPassword());
      this.presentSignupErrorAlert(err);
      this.newAccountMode = true;
    });


  }


  setEmailAndPassword(signupEmail: string, hashPassword: string): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this.authenticate().then( () => {
        self.saveEmail(signupEmail).then( () => {
          self.savePassword(hashPassword).then( () => {
            resolve();
          }).catch( () => {
            reject();
          });
        }).catch( (emailError) => {
          console.log('setEmailAndPassword email error : ', emailError);
          reject(emailError);
        });
      }).catch( () => {
        reject();
      });
    });
  }


  switchDemoMode() {
    if ( !this.ctx.getDemoMode() ) {
      console.log('Switch Demo on');
      this.ctx.setDemoMode(true);
      this.demoMode = true;
    }
    else {
      console.log('Switch Demo off');
      this.ctx.setDemoMode(false);
      this.demoMode = false;
    }
    this.ctx.save();
  }


}
