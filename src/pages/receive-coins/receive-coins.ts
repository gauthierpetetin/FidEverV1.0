import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

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

  address: string = null;

  coinColor: string;

  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public ethapiProvider: EthapiProvider,
    public ctx: ContextProvider,
    public loadingCtrl: LoadingController,
    private translateService: TranslateService
  ){
    // If we navigated to this page, we will have an item available as a nav param
    this.address = this.ctx.getAddress();
    this.coinColor = navParams.get('coinColor');

    console.log(this.address);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiveCoinsPage');
    this.translateService.get('RECEIVE').subscribe(
      value => {
        // value is our translated string
        console.log('RECEIVE: ', value.toString());
      }
)
  }

  goBack() {
    this.viewCtrl.dismiss();
    //this.navCtrl.pop()
  }


}
