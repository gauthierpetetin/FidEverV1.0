import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ModalController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ReceiveCoinsPage } from '../receive-coins/receive-coins';
import { SendCoinsPage } from '../send-coins/send-coins';
import { HomePage } from '../home/home';
import { RewardPage } from '../reward/reward';

import { ImageLoaderConfig, ImageLoader } from 'ionic-image-loader';

import { ContextProvider} from '../../providers/context/context';

import { FidapiProvider } from '../../providers/fidapi/fidapi';
import { TransactionProvider} from '../../providers/transaction/transaction';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {

  public loading:Loading;

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

  //REWARDCONFIRM
  rewardAlertTitle: string;
  rewardAlertContent1: string;
  rewardAlertContent2: string;
  rewardAlertConfirm: string;
  rewardAlertCancel: string;

  //REWARDSUCCESS
  rewardSuccessTitle: string;
  rewardSuccessContent1: string;
  rewardSuccessContent2: string;

  //FUNDS
  fundsAlertTitle: string;
  fundsAlertContent1: string;
  fundsAlertContent2: string;

  alertTitle: string;
  alertText: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private imageLoaderConfig: ImageLoaderConfig,
    public imageLoader: ImageLoader,
    public ctx: ContextProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public transactionProvider: TransactionProvider,
    public fidapiProvider: FidapiProvider,
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
    this.offerImages = this.ctx.getOfferImages(this.coinContractAddress);
    this.rewards = this.ctx.getRewards(this.coinContractAddress);

    this.alertTitle = this.transactionProvider.alertTitle;
    this.alertText = this.transactionProvider.alertText;


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
    this.translateService.get('ITEM_DETAIL.REWARDALERTCONFIRM.TITLE').subscribe(rewardAlertTitle => { this.rewardAlertTitle = rewardAlertTitle.toString(); });
    this.translateService.get('ITEM_DETAIL.REWARDALERTCONFIRM.CONTENT_1').subscribe(rewardAlertContent1 => { this.rewardAlertContent1 = rewardAlertContent1.toString(); });
    this.translateService.get('ITEM_DETAIL.REWARDALERTCONFIRM.CONTENT_2').subscribe(rewardAlertContent2 => { this.rewardAlertContent2 = rewardAlertContent2.toString(); });
    this.translateService.get('ITEM_DETAIL.REWARDALERTCONFIRM.CONFIRM').subscribe(rewardAlertConfirm => { this.rewardAlertConfirm = rewardAlertConfirm.toString(); });
    this.translateService.get('ITEM_DETAIL.REWARDALERTCONFIRM.CANCEL').subscribe(rewardAlertCancel => { this.rewardAlertCancel = rewardAlertCancel.toString(); });

    this.translateService.get('ITEM_DETAIL.FUNDSALERT.TITLE').subscribe(fundsAlertTitle => { this.fundsAlertTitle = fundsAlertTitle.toString(); });
    this.translateService.get('ITEM_DETAIL.FUNDSALERT.CONTENT_1').subscribe(fundsAlertContent1 => { this.fundsAlertContent1 = fundsAlertContent1.toString(); });
    this.translateService.get('ITEM_DETAIL.FUNDSALERT.CONTENT_2').subscribe(fundsAlertContent2 => { this.fundsAlertContent2 = fundsAlertContent2.toString(); });

    this.translateService.get('ITEM_DETAIL.REWARDALERTSUCCESS.TITLE').subscribe(rewardSuccessTitle => { this.rewardSuccessTitle = rewardSuccessTitle.toString(); });
    this.translateService.get('ITEM_DETAIL.REWARDALERTSUCCESS.CONTENT_1').subscribe(rewardSuccessContent1 => { this.rewardSuccessContent1 = rewardSuccessContent1.toString(); });
    this.translateService.get('ITEM_DETAIL.REWARDALERTSUCCESS.CONTENT_2').subscribe(rewardSuccessContent2 => { this.rewardSuccessContent2 = rewardSuccessContent2.toString(); });

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
      coinContractAddress: this.coinContractAddress
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

  offerTapped(event, offerID: string) {
    console.log('Offer tapped : ', offerID);
    let coinAmount: number = this.ctx.getCoinAmount(this.coinContractAddress);
    let offerPrice: number = this.ctx.getOfferPrice(this.coinContractAddress, offerID);
    if (coinAmount >= offerPrice) {
      this.offerProposal(offerID);
    }
    else {
      this.forbidPurchase(offerPrice - coinAmount);
    }
  }


  offerProposal(offerID: string) {
    let offerPrice: number = this.ctx.getOfferPrice(this.coinContractAddress, offerID);
    let offerName: string = this.ctx.getOfferName(this.coinContractAddress, offerID);
    let alert = this.alertCtrl.create({
      title: this.rewardAlertTitle,
      subTitle: this.rewardAlertContent1.concat(' ', String(offerPrice), ' ', this.coinName, ' ', this.rewardAlertContent2, ' ', offerName, '.'),
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
          /*xxxxxxxxxxUNCOMMENT LINE****************/
          //this.offerConfirmed(offerID);
          this.goToReward(this.rewards.length-1);
          /*xxxxxxxxxxUNCOMMENT LINE****************/
        }
      }
    ]
    });
    alert.present();
  }

  goToReward(rewardIndex: number) {
    this.selectRewards();
    let selectedReward: any = this.rewards[rewardIndex];
    if(selectedReward) {
      this.rewardTapped(null, selectedReward[this.offerID]);
    }
  }


  offerConfirmed(offerID: string) {
    console.log('Open offerConfirmed : ', offerID);
    let coinAmount: number = this.ctx.getCoinAmount(this.coinContractAddress);
    let offerPrice: number = this.ctx.getOfferPrice(this.coinContractAddress, offerID);
    let offerName: string = this.ctx.getOfferName(this.coinContractAddress, offerID);
    if (coinAmount >= offerPrice) {

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();

      this.transactionProvider.sendCoins(
        this.coinContractAddress,
        offerPrice,
        this.ctx.getAddress(),
        this.ctx.getPrivateKey(),
        this.coinContractAddress
      ).then( (transactionH) => {
        this.loading.dismiss();
        this.fidapiProvider.rewardClaim(
          this.ctx.getUid(),
          this.coinContractAddress,
          offerID,
          transactionH
        ).then( () => {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: this.rewardSuccessTitle,
            subTitle: this.rewardSuccessContent1.concat(" ", offerName, " ", this.rewardSuccessContent2),
            buttons: ['OK']
          });
          alert.present();

        }).catch( (error) => {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'FidAPI error',
            subTitle: 'Error : '.concat(error),
            buttons: ['OK']
          });
          alert.present();

        });
      }).catch( (error) => {
        this.loading.dismiss();
        let alert = this.alertCtrl.create({
          title: error[this.alertTitle],
          subTitle: error[this.alertText],
          buttons: ['OK']
        });
        alert.present();
      });
    }
    else {
      this.forbidPurchase(offerPrice - coinAmount);
    }


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

  rewardTapped(event, rewardID) {
    let rewardName: string = this.ctx.getOfferName(this.coinContractAddress, rewardID);
    console.log('reward tapped : ', rewardID, ', ', rewardName);
    this.modalCtrl.create(RewardPage, {
      reward: rewardID,
      name: rewardName,
      coinColor: this.ctx.getCoinColor(this.coinContractAddress),
      image: this.offerImages[rewardID]
    }).present();
  }

}
