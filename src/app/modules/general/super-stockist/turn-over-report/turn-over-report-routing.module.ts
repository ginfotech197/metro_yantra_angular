import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnOverReportComponent } from 'src/app/pages/super-stockist/turn-over-report/turn-over-report.component';
import { AuthGuardSuperStockistServiceService } from 'src/app/services/auth-guard-super-stockist-service.service';

const routes: Routes = [
  { path: '', canActivate : [AuthGuardSuperStockistServiceService], component: TurnOverReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnOverReportRoutingModule { }
