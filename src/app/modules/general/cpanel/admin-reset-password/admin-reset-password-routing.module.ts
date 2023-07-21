import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminResetPasswordComponent } from '../../../../pages/cpanel/admin-reset-password/admin-reset-password.component';

import {AuthGuardAdminServiceService} from '../../../../services/auth-guard-admin-service.service';


const routes: Routes = [
  { path: '',
    canActivate : [AuthGuardAdminServiceService],
    component: AdminResetPasswordComponent,
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
export class AdminResetPasswordRoutingModule { }
