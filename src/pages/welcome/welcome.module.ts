import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';


/**************Modules**************************/
import { IonicImageLoader } from 'ionic-image-loader';


@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
    IonicImageLoader
  ],
  exports: [
    WelcomePage
  ]
})
export class WelcomePageModule {}
