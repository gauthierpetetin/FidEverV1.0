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
import { HomePage } from '../pages/home/home';
import { LoginPageModule } from '../pages/login/login.module';
import { SignupPageModule } from '../pages/signup/signup.module';
import { ResetPasswordPageModule } from '../pages/reset-password/reset-password.module';
import { ItemDetailPageModule } from '../pages/item-detail/item-detail.module';
import { ReceiveCoinsPageModule } from '../pages/receive-coins/receive-coins.module';
import { SendCoinsPageModule } from '../pages/send-coins/send-coins.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { MapPageModule } from '../pages/map/map.module';


/*********************FIDEVER************************/

@NgModule({
  declarations: [
    MyApp,
    HomePage
    //LoginPage,
    // SignupPage,
    // ResetPasswordPage,
    // ItemDetailPage,
    // ReceiveCoinsPage,
    // SendCoinsPage,
    // ProfilePage,
    // MapPage
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
    LoginPageModule,
    SignupPageModule,
    ResetPasswordPageModule,
    ItemDetailPageModule,
    ReceiveCoinsPageModule,
    SendCoinsPageModule,
    ProfilePageModule,
    MapPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
    //LoginPage,
    // SignupPage,
    // ResetPasswordPage,
    // ItemDetailPage,
    // ReceiveCoinsPage,
    // SendCoinsPage,
    // ProfilePage,
    // MapPage
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
