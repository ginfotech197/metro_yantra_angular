import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockistResetPasswordComponent } from 'src/app/pages/stockist/stockist-reset-password/stockist-reset-password.component';
import { AuthGuardStockistServiceService } from 'src/app/services/auth-guard-stockist-service.service';

const routes: Routes = [
  { path: '',canActivate : [AuthGuardStockistServiceService], component: StockistResetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockistResetPasswordRoutingModule { }
