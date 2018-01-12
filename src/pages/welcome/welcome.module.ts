import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';


/**************Modules**************************/
import { IonicImageLoader } from 'ionic-image-loader';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
    IonicImageLoader,
    TranslateModule.forChild()
  ],
  exports: [
    WelcomePage
  ]
})
export class WelcomePageModule {}
