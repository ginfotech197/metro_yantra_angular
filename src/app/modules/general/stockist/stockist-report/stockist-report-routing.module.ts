import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StockiestReportComponent} from '../../../../pages/stockist/stockiest-report/stockiest-report.component';
import {AuthGuardAdminServiceService} from '../../../../services/auth-guard-admin-service.service';
import {AuthGuardStockistServiceService} from '../../../../services/auth-guard-stockist-service.service';

const routes: Routes = [
  { path: '',canActivate : [AuthGuardStockistServiceService], component: StockiestReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockistReportRoutingModule { }
