import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperStockistComponent} from '../../../pages/super-stockist/super-stockist.component';
import {AuthGuardSuperStockistServiceService} from '../../../services/auth-guard-super-stockist-service.service';

const routes: Routes = [
  { path: '', canActivate : [AuthGuardSuperStockistServiceService], component: SuperStockistComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperStockistRoutingModule { }
