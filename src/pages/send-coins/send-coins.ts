import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, Loading, AlertController } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { ContextProvider} from '../../providers/context/context';
import { TransactionProvider} from '../../providers/transaction/transaction';
/**
 * Generated class for the SendCoinsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-send-coins',
  templateUrl: 'send-coins.html',
})
export class SendCoinsPage {

  public loading:Loading;

  navbarID: string = "colorNavbar-send";

  coinContractAddress : any;
  toAddress : string = null;

  scannedCode : any = null;
  coinAmount : number;
  transactionSubmitted : boolean;

  coinName : string;
  coinColor : string;
  coinIcon : string;

  info : string;
  address : string;
  privateKey : string;

  alertTitle: string;
  alertText: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private barcodeScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public ctx: ContextProvider,
    public transactionProvider: TransactionProvider
  ) {
    this.coinContractAddress = navParams.get('coinContractAddress');

    this.coinName = this.ctx.getCoinName(this.coinContractAddress);
    this.coinColor = this.ctx.getCoinColor(this.coinContractAddress);
    this.coinIcon = this.ctx.getCoinIcon(this.coinContractAddress);

    this.info = this.ctx.info;
      this.address = this.ctx.getAddress();
      this.privateKey = this.ctx.getPrivateKey();

    this.transactionSubmitted = false;
    this.alertTitle = this.transactionProvider.alertTitle;
    this.alertText = this.transactionProvider.alertText;


    // ------ To be deleted -----------
    // this.toAddress = "0xbe5c6930b754df6dc6a7a7f17f12180335e7bc75";
    // this.coinAmount = 14;
    // this.transactionSubmitted = true;

    console.log('Color : ', this.coinColor);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendCoinsPage');
    document.getElementById(this.navbarID).style.backgroundColor = this.coinColor;
  }

  scanCode() {
    if(this.ctx.cordovaPlatform) {
      this.barcodeScanner.scan().then(barcodeData => {
        this.scannedCode = barcodeData.text;
      });
    }
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

  sendCoins() {
    console.log('Open sendCoins');
    this.toAddress = this.scannedCode;

    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();

    this.transactionProvider.sendCoins(
      this.toAddress,
      this.coinAmount,
      this.ctx.getAddress(),
      this.ctx.getPrivateKey(),
      this.coinContractAddress
    ).then( () => {
      this.loading.dismiss();
      this.transactionSubmitted = true;
      this.toAddress = null;
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

}
