import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { EthapiProvider } from '../../providers/ethapi/ethapi';
import { ContextProvider} from '../../providers/context/context';

/**
 * Generated class for the ReceiveCoinsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-receive-coins',
  templateUrl: 'receive-coins.html',
})
export class ReceiveCoinsPage {

  info: any;
  address: any;

  coinColor: any;
  scannedCode = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public ethapiProvider: EthapiProvider,
    public ctx: ContextProvider
  ){
    // If we navigated to this page, we will have an item available as a nav param
    this.info = this.ctx.info;
    this.address = this.ctx.address;

    this.coinColor = navParams.get('coinColor');

    console.log(this.ctx.c[this.info][this.address]);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiveCoinsPage');
  }

  goBack() {
    this.viewCtrl.dismiss();
    //this.navCtrl.pop()
  }


}
