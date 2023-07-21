import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnOverReportComponent } from 'src/app/pages/cpanel/turn-over-report/turn-over-report.component';
import { AuthGuardAdminServiceService } from 'src/app/services/auth-guard-admin-service.service';

const routes: Routes = [
  { path: '',
    canActivate : [AuthGuardAdminServiceService],
    component: TurnOverReportComponent,
    data: {
      title: 'About',
      description: 'Description Meta Tag Content',
      ogUrl: 'your og url'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
// @ts-ignore
export class TurnOverReportRoutingModule { }
