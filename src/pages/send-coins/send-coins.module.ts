import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendCoinsPage } from './send-coins';


/**************Modules**************************/
import { IonicImageLoader } from 'ionic-image-loader';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    SendCoinsPage,
  ],
  imports: [
    IonicPageModule.forChild(SendCoinsPage),
    IonicImageLoader,
    TranslateModule.forChild()
  ],
  exports: [
    SendCoinsPage
  ]
})
export class SendCoinsPageModule {}
