import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemDetailPage } from './item-detail';


/**************Modules**************************/
import { IonicImageLoader } from 'ionic-image-loader';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ItemDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailPage),
    IonicImageLoader,
    TranslateModule.forChild()
  ],
  exports: [
    ItemDetailPage
  ]
})
export class ItemDetailPageModule {}
