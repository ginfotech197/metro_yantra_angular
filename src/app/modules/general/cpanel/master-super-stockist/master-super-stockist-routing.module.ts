import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuardAdminServiceService} from '../../../../services/auth-guard-admin-service.service';
import {MasterSuperStockistComponent} from '../../../../pages/cpanel/master-super-stockist/master-super-stockist.component';

const routes: Routes = [
  { path: '', canActivate : [AuthGuardAdminServiceService], component: MasterSuperStockistComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSuperStockistRoutingModule { }
