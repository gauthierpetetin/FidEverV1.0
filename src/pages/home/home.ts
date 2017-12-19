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

      //this.imageLoader.preload('../assets/images/background/background75.png');

      // Variables for html
      this.info = this.ctx.info;
      this.contractAddresses = this.ctx.contractAddresses;

      this.ctx.init();

      /*****
        TEST RAPH

      console.log("Start transfer token")
      let contractAddress = "0xbe5c6930b754df6dc6a7a7f17f12180335e7bc75"
      let fromAddress = "0x35c41D5f7c31831be6C7bE20373C14647201Deb8"
      let fromPrivateKey = "0xae10b8fb12a30aa26c904b940205670b36f8ac62f00f830b88c9e3a44928fef4"
      let toAddress = "0xA328420c9235A080eB361dC12AF73974C16702f1"
      this.ethapiProvider.transfer(contractAddress, fromAddress, fromPrivateKey, toAddress, 5)
*/

      console.log('Close Homepage constructor');
  }

  logOut(): void {
    console.log('Open logOut');
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
    console.log('Close logOut');
  }

  itemTapped(event, contractAddress) {
    console.log('itemTapped : ',contractAddress);

    // let options: NativeTransitionOptions = {
    //   direction: 'right',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50
    //  };
    //
    // this.nativePageTransitions.slide(options);

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
    myModalCtrl.onDidDismiss(data => {
      console.log('Dismiss receive-coins : ',data);
    });
    myModalCtrl.present();
  }

  showProfile() {
    let myModalCtrl = this.modalCtrl.create(ProfilePage);
    // myModalCtrl.onDidDismiss(data => {
    //   console.log('Dismiss profile data : ',data);
    //   if(data['disconnect']=='yes') {
    //     this.authProvider.logoutUser().then(() => {
    //       this.navCtrl.setRoot(LoginPage);
    //     });
    //   }
    //   else {
    //     console.log('No disconnection required');
    //   }
    // });
    myModalCtrl.present();
  }

  showMap() {
    let myModalCtrl = this.modalCtrl.create(MapPage);
    myModalCtrl.onDidDismiss(data => {
      console.log('Dismiss map : ',data);
    });
    myModalCtrl.present();
  }

  // slidePage() {
  //   console.log('Slide Page');
  //   let options: NativeTransitionOptions = {
  //     direction: 'left',
  //     duration: 400,
  //     slowdownfactor: -1,
  //     iosdelay: 50
  //    };
  //
  //   this.nativePageTransitions.slide(options);
  //   //this.navCtrl.setRoot('ProfilePage');
  //   this.navCtrl.push('ProfilePage');
  // }

  // flipPage() {
  //   console.log('Flip Page');
  //   let options: NativeTransitionOptions = {
  //     direction: 'right',
  //     duration: 600
  //    };
  //
  //   this.nativePageTransitions.flip(options);
  //   this.navCtrl.setRoot('ProfilePage');
  //   //this.navCtrl.push('ProfilePage');
  // }
  //
  // fadePage() {
  //   console.log('Fade Page');
  //   this.nativePageTransitions.fade(null);
  //   this.navCtrl.setRoot('ProfilePage');
  // }

}
