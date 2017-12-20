import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemDetailPage } from './item-detail';


/**************Modules**************************/
import { IonicImageLoader } from 'ionic-image-loader';


@NgModule({
  declarations: [
    ItemDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailPage),
    IonicImageLoader,
  ],
  exports: [
    ItemDetailPage
  ]
})
export class ItemDetailPageModule {}
