import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ReceiveCoinsPage } from '../receive-coins/receive-coins';
import { SendCoinsPage } from '../send-coins/send-coins';
import { HomePage } from '../home/home';

import { ImageLoaderConfig, ImageLoader } from 'ionic-image-loader';

import { ContextProvider} from '../../providers/context/context';

//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {

  coinContractAddress: any;


  coinName : string;
  coinColor : string;
  coinIcon : string;
  landscape: string;
  brandIcon: string;
  companyName: string;
  offers: any [];
    offerID: string;
    offerName: string;
    offerPrice: string;
  offerImages: any;

  pageWillLeave : boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private imageLoaderConfig: ImageLoaderConfig,
    public imageLoader: ImageLoader,
    public ctx: ContextProvider
    //private nativePageTransitions: NativePageTransitions
  ) {

    console.log('Open Item-detail');

    this.imageLoaderConfig.enableSpinner(true);

    // If we navigated to this page, we will have an item available as a nav param
    this.coinContractAddress = navParams.get('coinContractAddress');

    this.coinName = this.ctx.getCoinName(this.coinContractAddress);
    this.coinColor = this.ctx.getCoinColor(this.coinContractAddress);
    this.coinIcon = this.ctx.getCoinIcon(this.coinContractAddress);
    this.landscape = this.ctx.getLandscape(this.coinContractAddress);
    this.brandIcon = this.ctx.getBrandIcon(this.coinContractAddress);
    this.companyName = this.ctx.getCompanyName(this.coinContractAddress);
    this.offers = this.ctx.getOffers(this.coinContractAddress);
      this.offerID = this.ctx.offerID;
      this.offerName = this.ctx.offerName;
      this.offerPrice = this.ctx.offerPrice;
    this.offerImages = this.ctx.getOfferImages(this.coinContractAddress);


    console.log('Item-detail offers : ', this.offers);
    console.log('Item-detail offerImages : ', this.offerImages);

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

  offerTapped() {
    console.log('Offer tapped');
  }

}
