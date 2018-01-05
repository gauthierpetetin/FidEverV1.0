import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { ItemDetailPage } from '../item-detail/item-detail';
import { ProfilePage } from '../profile/profile';
import { MapPage } from '../map/map';
import { ReceiveCoinsPage } from '../receive-coins/receive-coins';

import { AuthProvider } from '../../providers/auth/auth';
import { ContextProvider} from '../../providers/context/context';

import { ImageLoaderConfig, ImageLoader } from 'ionic-image-loader';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

// export interface Coin {
//   amount: number;
//   coinColor: string;
//   coinName: string;
// }

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //Useful for HTML
  info : string;
  contractAddresses : string;
  //names : string;
  //colors : string;
  //amounts : string;
  //icons : string;

  // ethapi: any;
  // web3: any;
  // qrData: any;
  // account: any;
  // address: any;
  // balance: any;
  // contractAddress: any;
  // checklists: any;
  // hairCoin: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authProvider: AuthProvider,
    public ctx: ContextProvider,
    private imageLoaderConfig: ImageLoaderConfig,
    public imageLoader: ImageLoader,
    private barcodeScanner: BarcodeScanner
    //private nativePageTransitions: NativePageTransitions
  ) {

      console.log('Open Homepage constructor');

      this.imageLoaderConfig.enableSpinner(true);

      // Variables for html
      this.info = this.ctx.info;
      this.contractAddresses = this.ctx.contractAddresses;

      console.log('Close Homepage constructor');
  }


  itemTapped(event, contractAddress) {
    console.log('itemTapped : ',contractAddress);

    this.navCtrl.push(ItemDetailPage, {
      coinContractAddress : contractAddress
    });

  }

  // scanCode() {
  //   this.barcodeScanner.scan().then(barcodeData => {
  //     //********INSERT COIN TRANSACTION HERE*******************
  //     //this.scannedCode = barcodeData.text;
  //   });
  // }

  collectCoins() {
    let myModalCtrl = this.modalCtrl.create(ReceiveCoinsPage, {
      coinColor : this.ctx.fidOrange
    });
    // myModalCtrl.onDidDismiss(data => {
    //   console.log('Dismiss receive-coins : ',data);
    // });
    myModalCtrl.present();
  }

  showProfile() {
    let myModalCtrl = this.modalCtrl.create(ProfilePage);

    myModalCtrl.present();
  }

  showMap() {
    let myModalCtrl = this.modalCtrl.create(MapPage);
    myModalCtrl.onDidDismiss(data => {
      console.log('Dismiss map : ',data);
    });
    myModalCtrl.present();
  }

}
