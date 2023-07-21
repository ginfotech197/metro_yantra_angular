import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperStockistResetPasswordRoutingModule } from './super-stockist-reset-password-routing.module';
import { SuperStockistResetPasswordComponent } from 'src/app/pages/super-stockist/super-stockist-reset-password/super-stockist-reset-password.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'src/app/core/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [SuperStockistResetPasswordComponent],
  exports: [SuperStockistResetPasswordComponent],
  imports: [
    CommonModule,
    SuperStockistResetPasswordRoutingModule,
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
export class SuperStockistResetPasswordModule { }
