import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnOverReportRoutingModule } from './turn-over-report-routing.module';
import { TurnOverReportComponent } from '../../../../pages/stockist/turn-over-report/turn-over-report.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'src/app/core/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { NgbModalModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBRootModule, PopoverModule } from 'angular-bootstrap-md';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [TurnOverReportComponent],
  exports: [TurnOverReportComponent],
  imports: [
    CommonModule,
    TurnOverReportRoutingModule,
    MatTabsModule,
    MaterialModule,
    FlexLayoutModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSortModule,
    NgbToastModule,
    NgbModalModule,
    MDBRootModule,
    PopoverModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatRippleModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    NgSelectModule,
    Ng2SearchPipeModule,    
    NgxPaginationModule,
    MatProgressSpinnerModule,
  ]
})
// @ts-ignore
export class TurnOverReportModule { }
