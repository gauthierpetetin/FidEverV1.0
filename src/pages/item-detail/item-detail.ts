import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ReceiveCoinsPage } from '../receive-coins/receive-coins';
import { SendCoinsPage } from '../send-coins/send-coins';
import { HomePage } from '../home/home';
import { RewardPage } from '../reward/reward';

import { ImageLoaderConfig, ImageLoader } from 'ionic-image-loader';

import { ContextProvider} from '../../providers/context/context';

import { TranslateService } from '@ngx-translate/core';


//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {

  coinContractAddress: any;

  navbarID: string = "colorNavbar";

  selectedTab: number = 0;

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
  rewards: any [];

  //REWARDALERT
  rewardAlertTitle: string;
  rewardAlertContent1: string;
  rewardAlertContent2: string;
  rewardAlertConfirm: string;
  rewardAlertCancel: string;

  //FUNDSALERT
  fundsAlertTitle: string;
  fundsAlertContent1: string;
  fundsAlertContent2: string;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private imageLoaderConfig: ImageLoaderConfig,
    public imageLoader: ImageLoader,
    public ctx: ContextProvider,
    public alertCtrl: AlertController,
    private translateService: TranslateService
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
      this.offerName = this.ctx.offerName.concat('_',this.ctx.language);
      this.offerPrice = this.ctx.offerPrice;
    this.offerImages = this.ctx.getOfferImages(this.coinContractAddress);
    this.rewards = this.ctx.getRewards(this.coinContractAddress);

    if((this.offers.length > 0)&&(this.rewards.length==0)){
      console.log('this.rewards.push : ', this.rewards);
      this.rewards.push(this.offers[0]);
    }
    else{
      console.log('No this.rewards.push : ', this.rewards);
    }

    console.log('Item-detail offers : ', this.offers);
    console.log('Item-detail offerImages : ', this.offerImages);
    console.log('Item-detail rewards : ', this.rewards);

    this.translate();

  }

  translate() {
    this.translateService.get('ITEM_DETAIL.REWARDALERT.TITLE').subscribe(rewardAlertTitle => { this.rewardAlertTitle = rewardAlertTitle.toString(); });
    this.translateService.get('ITEM_DETAIL.REWARDALERT.CONTENT_1').subscribe(rewardAlertContent1 => { this.rewardAlertContent1 = rewardAlertContent1.toString(); });
    this.translateService.get('ITEM_DETAIL.REWARDALERT.CONTENT_2').subscribe(rewardAlertContent2 => { this.rewardAlertContent2 = rewardAlertContent2.toString(); });
    this.translateService.get('ITEM_DETAIL.REWARDALERT.CONFIRM').subscribe(rewardAlertConfirm => { this.rewardAlertConfirm = rewardAlertConfirm.toString(); });
    this.translateService.get('ITEM_DETAIL.REWARDALERT.CANCEL').subscribe(rewardAlertCancel => { this.rewardAlertCancel = rewardAlertCancel.toString(); });

    this.translateService.get('ITEM_DETAIL.FUNDSALERT.TITLE').subscribe(fundsAlertTitle => { this.fundsAlertTitle = fundsAlertTitle.toString(); });
    this.translateService.get('ITEM_DETAIL.FUNDSALERT.CONTENT_1').subscribe(fundsAlertContent1 => { this.fundsAlertContent1 = fundsAlertContent1.toString(); });
    this.translateService.get('ITEM_DETAIL.FUNDSALERT.CONTENT_2').subscribe(fundsAlertContent2 => { this.fundsAlertContent2 = fundsAlertContent2.toString(); });

  }

  receiveCoins() {
    this.modalCtrl.create(ReceiveCoinsPage, {
      coinColor : this.ctx.getCoinColor(this.coinContractAddress)
    }).present();

  }

  sendCoins() {
    let available_funds = this.ctx.getCoinAmount(this.coinContractAddress);
    if(available_funds<=0){
      let alert = this.alertCtrl.create({
        title: this.fundsAlertTitle,
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    this.modalCtrl.create(SendCoinsPage, {
      coinContractAddress: this.coinContractAddress,
      coinName: this.ctx.getCoinName(this.coinContractAddress),
      coinColor: this.ctx.getCoinColor(this.coinContractAddress),
      coinIcon: this.ctx.getCoinIcon(this.coinContractAddress)
    }).present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Item-detail');
    document.getElementById(this.navbarID).style.backgroundColor = this.coinColor;
  }

  ionViewWillLeave() {
    document.getElementById(this.navbarID).style.backgroundColor = 'transparent';
    console.log('IonViewWillLeave Item-detail');
  }

  offerTapped(event, selectedOffer) {
    console.log('Offer tapped : ', selectedOffer);
    var coinAmount: number = this.ctx.getCoinAmount(this.coinContractAddress);
    if (coinAmount >= selectedOffer[this.offerPrice]) {
      this.confirmPurchase(selectedOffer);
    }
    else {
      this.forbidPurchase(selectedOffer[this.offerPrice] - coinAmount);
    }
  }

  rewardTapped(event, selectedReward) {
    let rewardID = selectedReward[this.offerID];
    console.log('reward tapped : ', rewardID, ', ', selectedReward[this.offerName]);
    this.modalCtrl.create(RewardPage, {
      reward: rewardID,
      name: selectedReward[this.offerName],
      coinColor: this.ctx.getCoinColor(this.coinContractAddress),
      image: this.offerImages[rewardID]
    }).present();
  }

  confirmPurchase(selectedOffer: any) {
    let alert = this.alertCtrl.create({
      title: this.rewardAlertTitle,
      subTitle: this.rewardAlertContent1.concat(' ', selectedOffer[this.offerPrice], ' ', this.coinName, ' ', this.rewardAlertContent2, ' ', selectedOffer[this.offerName], '.'),
      cssClass: 'customAlerts',
      buttons: [
      {
        text: this.rewardAlertCancel,
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: this.rewardAlertConfirm,
        handler: () => {
          console.log('Confirm clicked');
        }
      }
    ]
    });
    alert.present();
  }

  forbidPurchase(missingAmount: number) {
    let alert = this.alertCtrl.create({
      title: this.fundsAlertTitle,
      subTitle: this.fundsAlertContent1.concat(' ', missingAmount.toString(), ' ', this.coinName, ' ', this.fundsAlertContent2),
      buttons: ['OK']
    });
    alert.present();
  }

  selectOffers() {
    this.selectedTab = 0;
  }

  selectRewards() {
    this.selectedTab = 1;
  }

}
