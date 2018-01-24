import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPage } from './map';

/**************Modules**************************/
import { IonicImageLoader } from 'ionic-image-loader';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MapPage,
  ],
  imports: [
    IonicPageModule.forChild(MapPage),
    IonicImageLoader,
    TranslateModule.forChild()
  ],
  exports: [
    MapPage
  ]
})
export class MapPageModule {}
