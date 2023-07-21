import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockistResetPasswordRoutingModule } from './stockist-reset-password-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/core/material.module';
import { MatTabsModule } from '@angular/material/tabs';
import { StockistResetPasswordComponent } from 'src/app/pages/stockist/stockist-reset-password/stockist-reset-password.component';


@NgModule({
  declarations: [StockistResetPasswordComponent],
  exports:[StockistResetPasswordComponent],
  imports: [
    CommonModule,
    StockistResetPasswordRoutingModule,
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
    
  ]
})
export class StockistResetPasswordModule { }
