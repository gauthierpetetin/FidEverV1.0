import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//import { SplashScreen } from '@ionic-native/splash-screen';
//import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';


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
import { GoogleMaps } from '@ionic-native/google-maps';


/**************Modules**************************/
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { IonicStorageModule } from '@ionic/storage';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { IonicImageLoader } from 'ionic-image-loader';


/**************Pages****************************/
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { HomePage } from '../pages/home/home';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { ReceiveCoinsPage } from '../pages/receive-coins/receive-coins';
import { SendCoinsPage } from '../pages/send-coins/send-coins';
import { ProfilePage } from '../pages/profile/profile';
import { MapPage } from '../pages/map/map';


/*********************FIDEVER PRO************************/

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    HomePage,
    ItemDetailPage,
    ReceiveCoinsPage,
    SendCoinsPage,
    ProfilePage,
    MapPage
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
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    HomePage,
    ItemDetailPage,
    ReceiveCoinsPage,
    SendCoinsPage,
    ProfilePage,
    MapPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //SplashScreen,
    //StatusBar,
    AlertProvider,
    AuthProvider,
    ContextProvider,
    FirestoreProvider,
    FidapiProvider,
    EthapiProvider,
    BarcodeScanner,
    GoogleMaps
  ]
})
export class AppModule {}
