import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveCoinsPage } from './receive-coins';


/**************Modules**************************/
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ReceiveCoinsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiveCoinsPage),
    NgxQRCodeModule,
    TranslateModule.forChild()
  ],
  exports: [
    ReceiveCoinsPage
  ]
})
export class ReceiveCoinsPageModule {}
