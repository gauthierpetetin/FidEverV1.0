import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ReceiveCoinsPage } from '../receive-coins/receive-coins';
import { SendCoinsPage } from '../send-coins/send-coins';
import { HomePage } from '../home/home';

import { ImageLoaderConfig, ImageLoader } from 'ionic-image-loader';

import { ContextProvider} from '../../providers/context/context';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {

  coinContractAddress: any;


  coinName : string;
  coinColor : string;
  coinIcon : string;

  pageWillLeave : boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private imageLoaderConfig: ImageLoaderConfig,
    public imageLoader: ImageLoader,
    public ctx: ContextProvider,
    private nativePageTransitions: NativePageTransitions
  ) {

    console.log('Open Item-detail');

    this.imageLoaderConfig.enableSpinner(true);

    //this.imageLoader.preload('../assets/images/background/background30.png');

    // If we navigated to this page, we will have an item available as a nav param
    this.coinContractAddress = navParams.get('coinContractAddress');

    this.coinName = this.ctx.getCoinName(this.coinContractAddress);
    this.coinColor = this.ctx.getCoinColor(this.coinContractAddress);
    this.coinIcon = this.ctx.getCoinIcon(this.coinContractAddress);

  }

  receiveCoins() {
    this.modalCtrl.create(ReceiveCoinsPage, {
      coinColor : this.ctx.getCoinColor(this.coinContractAddress)
    }).present();

  }

  sendCoins() {
    this.modalCtrl.create(SendCoinsPage, {
      coinContractAddress: this.coinContractAddress,
      coinName: this.ctx.getCoinName(this.coinContractAddress),
      coinColor: this.ctx.getCoinColor(this.coinContractAddress),
      coinIcon: this.ctx.getCoinIcon(this.coinContractAddress)
    }).present();
  }

  // goBack () {
  //   let options: NativeTransitionOptions = {
  //     direction: 'left',
  //     duration: 400,
  //     slowdownfactor: 4,
  //     iosdelay: 50
  //    };
  //   this.nativePageTransitions.slide(options);
  //
  //   if (this.navCtrl.canGoBack()) {
  //     console.log('pop item-detail');
  //     this.navCtrl.pop();
  //   }
  //   else{
  //     console.log('leave item-detail');
  //     this.navCtrl.setRoot(HomePage);
  //   }
  // }

  ionViewDidLoad() {
    this.pageWillLeave = false;
    console.log('ionViewDidLoad Item-detail');
  }

  ionViewWillLeave() {
    this.pageWillLeave = true;
    console.log('IonViewWillLeave Item-detail');
  }

}
