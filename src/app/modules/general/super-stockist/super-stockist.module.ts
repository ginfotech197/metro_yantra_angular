import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperStockistRoutingModule } from './super-stockist-routing.module';
import {SuperStockistComponent} from '../../../pages/super-stockist/super-stockist.component';


@NgModule({
  declarations: [SuperStockistComponent],
  imports: [
    CommonModule,
    SuperStockistRoutingModule
  ],
  exports: [
    SuperStockistComponent
  ]
})
export class SuperStockistModule { }
