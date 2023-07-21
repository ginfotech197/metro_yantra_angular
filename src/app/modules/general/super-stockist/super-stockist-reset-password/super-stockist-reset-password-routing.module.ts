import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperStockistResetPasswordComponent } from 'src/app/pages/super-stockist/super-stockist-reset-password/super-stockist-reset-password.component';
import { AuthGuardSuperStockistServiceService } from 'src/app/services/auth-guard-super-stockist-service.service';

const routes: Routes = [
  { path: '', canActivate : [AuthGuardSuperStockistServiceService], component: SuperStockistResetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperStockistResetPasswordRoutingModule { }
