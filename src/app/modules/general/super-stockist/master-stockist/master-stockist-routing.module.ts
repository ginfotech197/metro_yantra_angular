import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterStockistComponent } from 'src/app/pages/super-stockist/master-stockist/master-stockist.component';
import { AuthGuardSuperStockistServiceService } from 'src/app/services/auth-guard-super-stockist-service.service';

const routes: Routes = [
  { path: '',
  canActivate : [AuthGuardSuperStockistServiceService],
  component: MasterStockistComponent,
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
export class MasterStockistRoutingModule { }
