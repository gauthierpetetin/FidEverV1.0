import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ImageLoaderConfig, ImageLoader } from 'ionic-image-loader';

import JsBarcode from 'jsbarcode';

/**
 * Generated class for the RewardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-reward',
  templateUrl: 'reward.html',
})
export class RewardPage {

  reward: string = null;

  name: string;
  coinColor: string;
  image: string;

  @ViewChild('barcode') barcode: ElementRef;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private imageLoaderConfig: ImageLoaderConfig,
    public imageLoader: ImageLoader
  ) {
    this.imageLoaderConfig.enableSpinner(true);

    this.reward = navParams.get('reward');
    this.name = navParams.get('name');
    this.coinColor = navParams.get('coinColor');
    this.image = navParams.get('image');


    console.log('Open reward : ', this.name, ', ',this.image);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RewardPage');
    JsBarcode(this.barcode.nativeElement, '1234567809');
  }

  goBack() {
    this.viewCtrl.dismiss();
    //this.navCtrl.pop()
  }

}
