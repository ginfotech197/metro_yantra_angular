import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';



// @ts-ignore
const routes: Routes = [
  // {path: '', component: HomeComponent},
  {
    path: '',
    loadChildren: () => import('./modules/general/cpanel/result/result.module')
      .then(mod => mod.ResultModule),
    data: {
      loginType: 'Admin'
    }
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/general/auth/auth.module')
      .then(mod => mod.AuthModule),
    data: {
      loginType: 'All'
    }
  },
  {
    path: 'player',
    loadChildren: () => import('./modules/general/auth/auth.module')
      .then(mod => mod.AuthModule),
    data: {
      loginType: 'Terminal'
    }
  },
  {
    path: 'cp',
    loadChildren: () => import('./modules/general/auth/auth.module')
      .then(mod => mod.AuthModule),
    data: {
      loginType: 'Admin'
    }
  },
  {
    path: 'cPanel',
    loadChildren: () => import('./modules/general/cpanel/cpanel.module')
      .then(mod => mod.CpanelModule)
  },
  {
    path: 'superStockistTurnOverReport',
    loadChildren: () => import('./modules/general/super-stockist/turn-over-report/turn-over-report.module')
      .then(mod => mod.TurnOverReportModule)
  },
  {
    path: 'cPanelTurnOverReport',
    loadChildren: () => import('./modules/general/cpanel/turn-over-report/turn-over-report.module')
      .then(mod => mod.TurnOverReportModule)
  },
  {
    path: 'stockistTurnOverReport',
    loadChildren: () => import('./modules/general/stockist/turn-over-report/turn-over-report.module')
      .then(mod => mod.TurnOverReportModule)
  },
  {
    path: 'masterStockist',
    loadChildren: () => import('./modules/general/cpanel/master-stockist/master-stockist.module')
      .then(mod => mod.MasterStockistModule)
  },

  {
    path: 'stockistResetPassword',
    loadChildren: () => import('./modules/general/stockist/stockist-reset-password/stockist-reset-password.module')
      .then(mod => mod.StockistResetPasswordModule)
  },

  {
    path: 'superStockistReport',
    loadChildren: () => import('./modules/general/super-stockist/super-stockist-report/super-stockist-report.module')
      .then(mod => mod.SuperStockistReportModule)
  },

  {
    path: 'cPanelSettings',
    loadChildren: () => import('./modules/general/cpanel/settings/settings.module')
      .then(mod => mod.SettingsModule)
  },

  {
    path: 'masterTerminal',
    loadChildren: () => import('./modules/general/cpanel/master-terminal/master-terminal.module')
      .then(mod => mod.MasterTerminalModule)
  },
  {
    path: 'manual',
    loadChildren: () => import('./modules/general/cpanel/manual-result/manual-result.module')
      .then(mod => mod.ManualResultModule)
  },
  {
    path: 'message',
    loadChildren: () => import('./modules/general/cpanel/message/message.module')
      .then(mod => mod.MessageModule)
  },
  {
    path: 'payoutSettings',
    loadChildren: () => import('./modules/general/cpanel/payout-setting/payout-setting.module')
      .then(mod => mod.PayoutSettingModule)
  },
  {
    path: 'stockiestMasterTerminal',
    loadChildren: () => import('./modules/general/stockist/master-terminal/master-terminal.module')
      .then(mod => mod.MasterTerminalModule)
  },



  {
    path: 'stockiestReport',
    loadChildren: () => import('./modules/general/stockist/stockist-report/stockist-report.module')
      .then(mod => mod.StockistReportModule)
  },
  {
    path: 'cPanelReports',
    loadChildren: () => import('./modules/general/cpanel/admin-reports/admin-reports.module')
      .then(mod => mod.AdminReportsModule)
  },
  {
    path: 'cPanelResetPassword',
    loadChildren: () => import('./modules/general/cpanel/admin-reset-password/admin-reset-password.module')
      .then(mod => mod.AdminResetPasswordModule)
  },
  {
    path: 'load',
    loadChildren: () => import('./modules/general/cpanel/load/load.module')
      .then(mod => mod.LoadModule)
  },
  {
    path: 'resultCPanel',
    loadChildren: () => import('./modules/general/cpanel/result/result.module')
      .then(mod => mod.ResultModule)
  },
  {
    path: 'transactionReport',
    loadChildren: () => import('./modules/general/cpanel/transaction-report/transaction-report.module')
      .then(mod => mod.TransactionReportModule)
  },
  {
    path: 'terminal',
    loadChildren: () => import('./modules/general/terminal/terminal.module')
      .then(mod => mod.TerminalModule)
  },
  {
    path: 'developer',
    loadChildren: () => import('./modules/general/developer/developer.module')
      .then(mod => mod.DeveloperModule)
  },
  {
    path: 'stockistCPanel',
    loadChildren: () => import('./modules/general/stockist/stockist.module')
      .then(mod => mod.StockistModule)
  },
  {
    path: 'terminalReport',
    loadChildren: () => import('./modules/general/terminal-report/terminal-report.module')
      .then(mod => mod.TerminalReportModule)
  },
  {
    path: 'superStockistCPanel',
    loadChildren: () => import('./modules/general/cpanel/master-super-stockist/master-super-stockist.module')
      .then(mod => mod.MasterSuperStockistModule)
  },
  {
    path: 'superStockistMasterStockist',
    loadChildren: () => import('./modules/general/super-stockist/master-stockist/master-stockist-routing.module')
      .then(mod => mod.MasterStockistRoutingModule)
  },
  {
    path: 'superStockistDashboard',
    loadChildren: () => import('./modules/general/super-stockist/super-stockist.module')
      .then(mod => mod.SuperStockistModule)
  },
  {
    path: 'superStockistTerminal',
    loadChildren: () => import('./modules/general/super-stockist/master-terminal/master-terminal.module')
      .then(mod => mod.MasterTerminalModule)
  },

  {
    path: 'superStockistResetPassword',
    loadChildren: () => import('./modules/general/super-stockist/super-stockist-reset-password/super-stockist-reset-password.module')
      .then(mod => mod.SuperStockistResetPasswordModule)
  },

  {
    path: 'bi-icon',
    loadChildren: () => import('./modules/general/bi-icon/bi-icon.module')
      .then(mod => mod.BiIconModule)
  },
  { path: 'Receipt', loadChildren: () => import('./pages/cpanel/receipt/receipt.module').then(m => m.ReceiptModule) },
  // {path: 'auth', component: AuthComponent},
  // {path: 'player', component: AuthComponent},
  // {path: 'power', component: AuthComponent},
  // {path: 'cPanel', canActivate : [AuthGuardAdminServiceService], component: CpanelComponent},
  // {path: 'stockistCPanel', canActivate : [AuthGuardStockistServiceService], component: StockistComponent},
  // {path: 'terminal', canActivate : [AuthGuardTerminalServiceService], component: TerminalComponent},
  // {path: 'developer', canActivate : [AuthGuardDeveloperServiceService], component: DeveloperComponent},
  // {path: 'manual', canActivate : [AuthGuardAdminServiceService], component: ManualResultComponent},
  // {path: 'masterStockist', canActivate : [AuthGuardAdminServiceService], component: MasterStockistComponent},
  // {path: 'bi-icon', component: BiIconComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
