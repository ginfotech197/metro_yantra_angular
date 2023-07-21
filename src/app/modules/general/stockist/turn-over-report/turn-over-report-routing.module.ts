import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuardStockistServiceService} from '../../../../services/auth-guard-stockist-service.service';
import {TurnOverReportComponent} from '../../../../pages/stockist/turn-over-report/turn-over-report.component';


const routes: Routes = [
  { path: '',canActivate : [AuthGuardStockistServiceService ], component: TurnOverReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
// @ts-ignore
export class TurnOverReportRoutingModule { }
