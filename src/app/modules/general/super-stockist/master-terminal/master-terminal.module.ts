import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterTerminalRoutingModule } from './master-terminal-routing.module';
import { MasterTerminalComponent } from 'src/app/pages/super-stockist/master-terminal/master-terminal.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MaterialModule} from "../../../../core/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {NgSelectModule} from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [MasterTerminalComponent],
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
    // MatSortModule,
    // MatSelectModule,
    // MatIconModule,
    // NgSelectModule,
    Ng2SearchPipeModule,    
    NgxPaginationModule,
    MatProgressSpinnerModule

  ]
})
export class MasterTerminalModule { }
