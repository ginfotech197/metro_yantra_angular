import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpanelRoutingModule } from './cpanel-routing.module';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CpanelComponent} from '../../../pages/cpanel/cpanel.component';
import {ManualResultModule} from './manual-result/manual-result.module';
import {NgxPrintModule} from 'ngx-print';
import {ReceiptModule} from '../../../pages/cpanel/receipt/receipt.module';
import {NgApexchartsModule} from 'ng-apexcharts';


// @ts-ignore
@NgModule({
  imports: [
    CommonModule,
    CpanelRoutingModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    NgxPrintModule,
    ReceiptModule,
    NgApexchartsModule,
  ],
  exports: [
    CpanelComponent
  ],
  declarations: [
    CpanelComponent
  ],
})
// @ts-ignore
export class CpanelModule { }
