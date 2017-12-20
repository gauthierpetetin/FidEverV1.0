import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';


/**************Modules**************************/
import { IonicImageLoader } from 'ionic-image-loader';
import { NgxQRCodeModule } from 'ngx-qrcode2';


@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    IonicImageLoader,
    NgxQRCodeModule,
  ],
  exports: [
    ProfilePage
  ]
})
export class ProfilePageModule {}
