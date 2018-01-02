import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RewardPage } from './reward';


/**************Modules**************************/
import { IonicImageLoader } from 'ionic-image-loader';
import { NgxQRCodeModule } from 'ngx-qrcode2';


@NgModule({
  declarations: [
    RewardPage,
  ],
  imports: [
    IonicPageModule.forChild(RewardPage),
    IonicImageLoader,
    NgxQRCodeModule
  ],
  exports: [
    RewardPage
  ]
})
export class RewardPageModule {}
