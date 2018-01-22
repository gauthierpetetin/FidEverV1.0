import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoinAlertPage } from './coin-alert';

@NgModule({
  declarations: [
    CoinAlertPage,
  ],
  imports: [
    IonicPageModule.forChild(CoinAlertPage),
  ],
})
export class CoinAlertPageModule {}
