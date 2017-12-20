import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveCoinsPage } from './receive-coins';


/**************Modules**************************/
import { NgxQRCodeModule } from 'ngx-qrcode2';


@NgModule({
  declarations: [
    ReceiveCoinsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiveCoinsPage),
    NgxQRCodeModule,
  ],
  exports: [
    ReceiveCoinsPage
  ]
})
export class ReceiveCoinsPageModule {}
