import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnOverReportRoutingModule } from './turn-over-report-routing.module';
import { TurnOverReportComponent } from 'src/app/pages/cpanel/turn-over-report/turn-over-report.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatBadgeModule } from '@angular/material/badge';
import { MDBRootModule, PopoverModule } from 'angular-bootstrap-md';
import { NgbModalModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatIcon, MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [TurnOverReportComponent],
  exports:[TurnOverReportComponent],
  imports: [
    CommonModule,
    TurnOverReportRoutingModule,
    MatTabsModule,
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
    MatIconModule
  ]
})
export class TurnOverReportModule { }
