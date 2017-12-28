import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AlertController } from 'ionic-angular';

import { EthapiProvider } from '../../providers/ethapi/ethapi';
import { ContextProvider} from '../../providers/context/context';
import { FidapiProvider} from '../../providers/fidapi/fidapi';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private barcodeScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    public ethapiProvider: EthapiProvider,
    public loadingCtrl: LoadingController,
    public ctx: ContextProvider,
    public fidapiProvider: FidapiProvider
  ) {
    this.coinContractAddress = navParams.get('coinContractAddress');

    this.coinName = this.ctx.getCoinName(this.coinContractAddress);
    this.coinColor = this.ctx.getCoinColor(this.coinContractAddress);
    this.coinIcon = this.ctx.getCoinIcon(this.coinContractAddress);

    this.info = this.ctx.info;
      this.address = this.ctx.getAddress();
      this.privateKey = this.ctx.getPrivateKey();

    this.coinAmount = 0;
    this.transactionSubmitted = false;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendCoinsPage');
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
    });
  }

  goBack() {
    //this.navCtrl.pop();
    this.viewCtrl.dismiss();
  }

  sendCoins() {
    console.log('Open sendCoins');

    if(this.scannedCode != null) {

      if(this.coinAmount > 0) {

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();

      this.toAddress = this.scannedCode;

      //-------UNCOMMENT TO SEND TOKENS------------
      this.ethapiProvider.transfer(
        this.coinContractAddress,
        this.ctx.c[this.info][this.address],//fromAddress
        this.ctx.c[this.info][this.privateKey],//fromPrivateKey
        this.toAddress,//toAddress
        this.coinAmount
      ).then( (transactionH) => {
        console.log('Coin transfer submitted successfully to Blockchain : ',transactionH);
        this.fidapiProvider.transferCoins(
          this.coinContractAddress,
          this.ctx.c[this.info][this.address],//fromAddress
          this.toAddress,//toAddress
          this.coinAmount,
          transactionH
        ).then( () => {
          console.log('Coin transfer submitted successfully to Firestore : ',transactionH);
          this.loading.dismiss();
          this.transactionSubmitted = true;
          this.scannedCode = null;
        }, (fidapi_error) => {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'FidApi error',
            buttons: ['OK']
          });
          alert.present();
          console.log('Error: Coin transfer on fidapi failed');
        }
        );
      }, (ethapi_error) => {
        if (ethapi_error == 'INVALID') {
          let alert = this.alertCtrl.create({
            title: 'Invalid recipient',
            subTitle: 'Please select a valid recipient.',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'EthApi error',
            buttons: ['OK']
          });
          alert.present();
        }
        this.loading.dismiss();
        console.log('Error: Coin transfer on Blockchain failed');
      });

      }
      else{
        let alert = this.alertCtrl.create({
          title: 'Negtive coin amount',
          subTitle: 'Please select a positive amount of coins first.',
          buttons: ['OK']
        });
        alert.present();
      }
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'No recipient',
        subTitle: 'Please choose a recipient first.',
        buttons: ['OK']
      });
      alert.present();
    }

    console.log('Close sendCoins');
  }

}
