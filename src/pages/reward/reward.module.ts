import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RewardPage } from './reward';


/**************Modules**************************/
import { IonicImageLoader } from 'ionic-image-loader';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import JsBarcode from 'jsbarcode';
// import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RewardPage,
  ],
  imports: [
    IonicPageModule.forChild(RewardPage),
    IonicImageLoader,
    NgxQRCodeModule,
    // TranslateModule.forChild()
  ],
  exports: [
    RewardPage
  ]
})
export class RewardPageModule {}
