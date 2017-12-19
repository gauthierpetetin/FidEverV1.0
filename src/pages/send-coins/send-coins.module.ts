import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendCoinsPage } from './send-coins';

@NgModule({
  declarations: [
    SendCoinsPage,
  ],
  imports: [
    IonicPageModule.forChild(SendCoinsPage),
  ],
  exports: [
    SendCoinsPage
  ]
})
export class SendCoinsPageModule {}
