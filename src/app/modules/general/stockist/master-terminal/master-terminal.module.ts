import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterTerminalRoutingModule } from './master-terminal-routing.module';
import {MatTabsModule} from "@angular/material/tabs";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatSortModule} from "@angular/material/sort";
import {MaterialModule} from "../../../../core/material.module";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MasterTerminalComponent} from "../../../../pages/stockist/master-terminal/master-terminal.component";
import {NgSelectModule} from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  // declarations: [],
  imports: [
    CommonModule,
    MasterTerminalRoutingModule,
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
    MatSortModule,
    Ng2SearchPipeModule,    
    NgxPaginationModule,
    MatProgressSpinnerModule,
    


  ],
  exports: [
    MasterTerminalComponent
  ],
  declarations: [
    MasterTerminalComponent
  ]
})
export class MasterTerminalModule { }
