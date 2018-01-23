import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//import { SplashScreen } from '@ionic-native/splash-screen';
//import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { HttpModule, Http } from '@angular/http';
//import { HttpClient, HttpClientModule } from '@angular/common/http';


/**************Confif parameters****************/
import { FIREBASE_CONFIG } from './app.config';


/**************Providers************************/
import { AuthProvider } from '../providers/auth/auth';
import { FirestoreProvider } from '../providers/firestore/firestore';
import { AlertProvider } from '../providers/alert/alert';
import { ContextProvider } from '../providers/context/context';
import { EthapiProvider } from '../providers/ethapi/ethapi';
import { FidapiProvider } from '../providers/fidapi/fidapi';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { WalletProvider } from '../providers/wallet/wallet';
import { TransactionProvider } from '../providers/transaction/transaction';
import { Geolocation } from '@ionic-native/geolocation';
import { Globalization } from '@ionic-native/globalization';


/**************Modules**************************/
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { IonicStorageModule } from '@ionic/storage';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { IonicImageLoader } from 'ionic-image-loader';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**************Pages****************************/
import { HomePage } from '../pages/home/home';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { LoginPageModule } from '../pages/login/login.module';
import { SignupPageModule } from '../pages/signup/signup.module';
import { ResetPasswordPageModule } from '../pages/reset-password/reset-password.module';
import { ItemDetailPageModule } from '../pages/item-detail/item-detail.module';
import { ReceiveCoinsPageModule } from '../pages/receive-coins/receive-coins.module';
import { SendCoinsPageModule } from '../pages/send-coins/send-coins.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { MapPageModule } from '../pages/map/map.module';
import { RewardPageModule } from '../pages/reward/reward.module';
import { UpdatePageModule } from '../pages/update/update.module';


/*********************FIDEVER************************/


export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    HttpModule,
    IonicStorageModule.forRoot(),
    NgxQRCodeModule,
    IonicImageLoader.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    WelcomePageModule,
    LoginPageModule,
    SignupPageModule,
    ResetPasswordPageModule,
    ItemDetailPageModule,
    ReceiveCoinsPageModule,
    SendCoinsPageModule,
    ProfilePageModule,
    MapPageModule,
    RewardPageModule,
    UpdatePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //SplashScreen,
    //StatusBar,
    ScreenOrientation,
    AlertProvider,
    AuthProvider,
    ContextProvider,
    FirestoreProvider,
    FidapiProvider,
    EthapiProvider,
    BarcodeScanner,
    Geolocation,
    WalletProvider,
    UniqueDeviceID,
    TransactionProvider,
    TranslateService,
    FirebaseAnalytics,
    Push,
    Globalization,
    ImagePicker,
    Camera
  ]
})
export class AppModule {}
