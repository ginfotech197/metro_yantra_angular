// import { BrowserModule } from '@angular/platform-browser';
import {DEFAULT_CURRENCY_CODE, NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './core/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import {AuthInterceptorInterceptor} from './services/auth-interceptor.interceptor';
import { DateAdapter } from '@angular/material/core';
import { DateFormat } from './date-format';
import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import { StockistComponent } from './pages/stockist/stockist.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatSliderModule} from '@angular/material/slider';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { HomeModule } from './modules/general/home/home.module';
import { HeaderModule } from './modules/general/header/header.module';
import { StockistModule } from './modules/general/stockist/stockist.module';
import { FooterModule } from './modules/general/footer/footer.module';
import { BiIconModule } from './modules/general/bi-icon/bi-icon.module';
import {NgxPrinterModule} from 'ngx-printer';
import {MatTabsModule} from '@angular/material/tabs';
import {NgMarqueeModule} from 'ng-marquee-improved';
import { SuperStockistModule } from './modules/general/super-stockist/super-stockist.module';
import { SuperStockistComponent } from './pages/super-stockist/super-stockist.component';
import { MasterTerminalModule } from './modules/general/super-stockist/master-terminal/master-terminal.module';
import { MasterStockistModule } from './modules/general/super-stockist/master-stockist/master-stockist.module';
import { LoadModule } from './modules/general/cpanel/load/load.module';
import { SuperStockistTransactionReportComponent } from './pages/cpanel/master-super-stockist/super-stockist-transaction-report/super-stockist-transaction-report.component';
import { TurnOverReportModule } from './modules/general/super-stockist/turn-over-report/turn-over-report.module';
import { TurnOverReportComponent } from './pages/stockist/turn-over-report/turn-over-report.component';
// import { MessageComponent } from './pages/cpanel/message/message.component';
// import { MessageModule } from './modules/general/cpanel/message/message.module';
// import { TurnOverReportComponent } from './pages/cpanel/turn-over-report/turn-over-report.component';
// import { TurnOverReportModule } from './modules/general/cpanel/turn-over-report/turn-over-report.module';
// import { TurnOverReportComponent } from './pages/super-stockist/turn-over-report/turn-over-report.component';
// import { TurnOverReportModule } from './modules/general/superStockist/turn-over-report/turn-over-report.module';
// import { StockistResetPasswordModule } from './modules/general/stockist/stockist-reset-password/stockist-reset-password.module';
// import { StockistResetPasswordComponent } from './pages/stockist/stockist-reset-password/stockist-reset-password.component';
// import { StockistResetPasswordModule } from './modules/general/super-stockist/stockist-reset-password/stockist-reset-password.module';
// import { SuperStockistResetPasswordComponent } from './pages/super-stockist/super-stockist-reset-password/super-stockist-reset-password.component';
// import { SuperStockistResetPasswordModule } from './modules/general/super-stockist/super-stockist-reset-password/super-stockist-reset-password.module';
// import { AdminResetPasswordComponent } from './pages/cpanel/admin-reset-password/admin-reset-password.component';
// import { AdminResetPasswordModule } from './modules/general/admin-reset-password/admin-reset-password.module';




@NgModule({
  declarations: [
    AppComponent,
    SuperStockistTransactionReportComponent,
    // MessageComponent,
    // TurnOverReportComponent,
    // TurnOverReportComponent,
    // TurnOverReportComponent,
    // StockistResetPasswordComponent,
    // SuperStockistResetPasswordComponent,
    // AdminResetPasswordComponent,
  ],
  imports: [
    AppRoutingModule,
    NgbModule,
    NgxPrinterModule.forRoot({printOpenWindow: false}),
    BrowserAnimationsModule,
    MatMenuModule,
    MatSidenavModule,
    MatSliderModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    HomeModule,
    HeaderModule,
    StockistModule,
    FooterModule,
    BiIconModule,
    MatTabsModule,
    NgMarqueeModule,
    LoadModule,
    // MessageModule,
    // TurnOverReportModule,
    // TurnOverReportModule,
    // TurnOverReportModule,
    // StockistResetPasswordModule,
    // StockistResetPasswordModule,
    // SuperStockistResetPasswordModule,
    // AdminResetPasswordModule,
  ],
  providers: [DatePipe,
              {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true},
              {provide: LocationStrategy, useClass: HashLocationStrategy},
              {provide: DateAdapter, useClass: DateFormat}, {provide: DEFAULT_CURRENCY_CODE, useValue: 'INR'} ],

  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
}
