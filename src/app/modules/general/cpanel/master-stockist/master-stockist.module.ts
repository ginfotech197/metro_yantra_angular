import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterStockistRoutingModule } from './master-stockist-routing.module';
import {MatTabsModule} from '@angular/material/tabs';
import {MasterStockistComponent} from '../../../../pages/cpanel/master-stockist/master-stockist.component';
import {MaterialModule} from '../../../../core/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {NgSelectModule} from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  imports: [
    CommonModule,
    MasterStockistRoutingModule,
    MatTabsModule,
    MaterialModule,
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSortModule,
    MatSelectModule,
    MatIconModule,
    NgSelectModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
  ],
  exports: [
    MasterStockistComponent
  ],
  declarations: [
    MasterStockistComponent
  ]
})
export class MasterStockistModule { }
