import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageComponent } from 'src/app/pages/cpanel/message/message.component';
import { AuthGuardAdminServiceService } from 'src/app/services/auth-guard-admin-service.service';

const routes: Routes = [
  { path: '',
    canActivate : [AuthGuardAdminServiceService],
    component: MessageComponent,
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
export class MessageRoutingModule { }
