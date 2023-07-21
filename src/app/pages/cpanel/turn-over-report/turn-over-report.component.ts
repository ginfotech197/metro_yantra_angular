import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TurnOver } from 'src/app/models/TurnOver.model';
import { AdminReportService } from 'src/app/services/admin-report.service';
import Swal from 'sweetalert2';
import {catchError, tap} from 'rxjs/operators';
import {ServerResponse} from '../../../models/ServerResponse.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {CPanelBarcodeReport} from '../../../models/CPanelBarcodeReport.model';

@Component({
  selector: 'app-turn-over-report',
  templateUrl: './turn-over-report.component.html',
  styleUrls: ['./turn-over-report.component.scss']
})
export class TurnOverReportComponent implements OnInit {

  thisYear = new Date().getFullYear();
  thisMonth = new Date().getMonth();
  thisDay = new Date().getDate();
  startDate = new Date(this.thisYear, this.thisMonth, this.thisDay);
  private BASE_API_URL = environment.BASE_API_URL;

  StartDateFilter = this.startDate;
  EndDateFilter = this.startDate;
  pipe = new DatePipe('en-US');
  super_stockist_id = null;
  stockistOverSuperStockist: TurnOver[] = [];
  stockistOverSuperStockistValue: TurnOver[] = [];

  superStockistTurnOverReportEnabled = true;
  stockistTurnOverReportEnabled = false;
  terminalTurnOverReportEnabled = false;
  superStockistTerminalBarcodeTurnOverReportEnabled = false;
  terminalBarcodeTurnOverReportEnabled = false;

  stockistTabStockistReportEnable = true;
  stockistTabTerminalReportEnable = false;

  superStockistTurnOverReport: TurnOver[] = [];
  superStockistTurnOverReportValue: TurnOver[] = [];
  stockistTurnOverReport: TurnOver[] = [];
  stockistTurnOverReportValue: TurnOver[] = [];
  terminalTurnOverReport: TurnOver[] = [];
  terminalTurnOverReportValue: TurnOver[] = [];
  barcodeReportRecords: CPanelBarcodeReport[] = [];

  // search variables
  superStockistSearch = null;
  stockistSearchOnSuperStockistTab = null;
  terminalSearchOnSuperStockistTab = null;
  stockistSearch = null;
  terminalSearchOnStockistTab = null;

  selectedTab = 0;

  superStockistToggle = 0;
  stockistToggle = 0;

  p = 1;


  constructor(private adminReportService: AdminReportService, private http: HttpClient) {
    this.selectedTab = 1;
  }

  ngOnInit(): void {
  }

  onTabChange($event){
    this.selectedTab = $event.index + 1;
    // console.log($event.index);
  }

  searchSuperStockistTurnOverReport(){

    Swal.fire({
      title: 'Please Wait !',
      html: 'It may take some time....', // add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.terminalTurnOverReportEnabled = false;
    this.stockistTurnOverReportEnabled = false;
    this.superStockistTurnOverReportEnabled = true;
    this.superStockistTerminalBarcodeTurnOverReportEnabled = false;
    // this.stockistTabStockistReportEnable=true;

    this.superStockistTurnOverReport = [];

    const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
    const endDate = this.pipe.transform(this.EndDateFilter, 'yyyy-MM-dd');
    this.adminReportService.adminSuperStockistTurnOverReport(startDate, endDate).subscribe((response) => {
      Swal.close();
      this.superStockistTurnOverReport = response.data;
      this.superStockistTurnOverReportValue =  this.superStockistTurnOverReport.filter(x => x.total_bet > 0);
    });
  }

  searchStockistTurnOverReport(){
    Swal.fire({
      title: 'Please Wait !',
      html: 'It may take some time....', // add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
    const endDate = this.pipe.transform(this.EndDateFilter, 'yyyy-MM-dd');
    this.adminReportService.adminStockistTurnOverReport(startDate, endDate).subscribe((response) => {
      Swal.close();
      this.stockistTurnOverReport = response.data;
      this.stockistTurnOverReportValue = this.stockistTurnOverReport.filter(x => x.total_bet > 0);
    });
  }

  onToggleSuperStockist(event){
    this.superStockistToggle = event.checked === true ? 1 : 0;
  }

  onToggleStockist(event){
    this.stockistToggle = event.checked === true ? 1 : 0;
  }

  searchStockist(superStockistData){
    Swal.fire({
      title: 'Please Wait !',
      html: 'It may take some time....', // add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
    const endDate = this.pipe.transform(this.EndDateFilter, 'yyyy-MM-dd');
    this.adminReportService.adminStockistOverSuperStockist(startDate, endDate, superStockistData.super_stockist_id).subscribe((response) => {
      if (response.data){
        Swal.close();
        this.stockistOverSuperStockist = response.data;
        this.stockistOverSuperStockistValue =  this.stockistOverSuperStockist.filter(x => x.total_bet > 0);
        this.superStockistTurnOverReportEnabled = false;
        this.stockistTurnOverReportEnabled = true;
      }
    });
  }

  revertBack(){
    if (this.selectedTab === 1){
      if (this.terminalTurnOverReportEnabled === true){
        this.terminalTurnOverReportEnabled = false;
        this.stockistTurnOverReportEnabled = true;
        this.superStockistTurnOverReportEnabled = false;
        this.superStockistTerminalBarcodeTurnOverReportEnabled = false;
      }else if (this.stockistTurnOverReportEnabled === true){
        this.terminalTurnOverReportEnabled = false;
        this.stockistTurnOverReportEnabled = false;
        this.superStockistTurnOverReportEnabled = true;
        this.superStockistTerminalBarcodeTurnOverReportEnabled = false;
      }else if (this.superStockistTerminalBarcodeTurnOverReportEnabled === true){
        this.terminalTurnOverReportEnabled = true;
        this.stockistTurnOverReportEnabled = false;
        this.superStockistTurnOverReportEnabled = false;
        this.superStockistTerminalBarcodeTurnOverReportEnabled = false;
      }
    }else if (this.selectedTab === 2){
      // this.stockistTabStockistReportEnable = true;
      // this.stockistTabTerminalReportEnable = false;
      if (this.stockistTabTerminalReportEnable === true) {
        this.stockistTabTerminalReportEnable = false;
        this.stockistTabStockistReportEnable = true;
        this.terminalBarcodeTurnOverReportEnabled = false;
      }else if (this.terminalBarcodeTurnOverReportEnabled === true) {
        this.stockistTabTerminalReportEnable = true;
        this.stockistTabStockistReportEnable = false;
        this.terminalBarcodeTurnOverReportEnabled = false;
      }  
    }
  }

  searchTerminalBarCode(terminalData){
    if (this.selectedTab === 1){
      Swal.fire({
        title: 'Please Wait !',
        html: 'It may take some time....', // add html attribute if you want or remove
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
      const endDate = this.pipe.transform(this.EndDateFilter, 'yyyy-MM-dd');
      // @ts-ignore
      this.http.post(this.BASE_API_URL + '/terminal/turnOverReport', {startDate, endDate, terminalId: terminalData.terminal_id}).subscribe((response) => {
        Swal.close();
        // @ts-ignore
        this.barcodeReportRecords = response.data;
        this.terminalTurnOverReportEnabled = false;
        this.stockistTurnOverReportEnabled = false;
        this.superStockistTurnOverReportEnabled = false;
        this.superStockistTerminalBarcodeTurnOverReportEnabled = true;
        this.stockistTabTerminalReportEnable = false;
      });
    }else if (this.selectedTab === 2){
      Swal.fire({
        title: 'Please Wait !',
        html: 'It may take some time....', // add html attribute if you want or remove
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
      const endDate = this.pipe.transform(this.EndDateFilter, 'yyyy-MM-dd');
      // @ts-ignore
      this.http.post(this.BASE_API_URL + '/terminal/turnOverReport', {startDate, endDate, terminalId: terminalData.terminal_id}).subscribe((response) => {
        Swal.close();
        // @ts-ignore
        this.barcodeReportRecords = response.data;
        this.terminalTurnOverReportEnabled = false;
        this.stockistTurnOverReportEnabled = false;
        this.superStockistTurnOverReportEnabled = false;
        this.terminalBarcodeTurnOverReportEnabled = true;
        this.stockistTabTerminalReportEnable = false;
      });
    }
    
  }

  searchTerminal(stockistData){
    Swal.fire({
      title: 'Please Wait !',
      html: 'It may take some time....', // add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
    const endDate = this.pipe.transform(this.EndDateFilter, 'yyyy-MM-dd');
    this.adminReportService.adminTerminalOverStockist(startDate, endDate, stockistData.stockist_id).subscribe((response) => {
      if (response.data) {
        Swal.close();
        this.terminalTurnOverReport = response.data;
        this.terminalTurnOverReportValue = this.terminalTurnOverReport.filter(x => x.total_bet > 0);
        if (this.selectedTab === 1){
          this.superStockistTurnOverReportEnabled = false;
          this.stockistTurnOverReportEnabled = false;
          this.terminalTurnOverReportEnabled = true;
        }else if (this.selectedTab === 2){
          this.stockistTabStockistReportEnable = false;
          this.stockistTabTerminalReportEnable = true;
        }
      }
    });
  }

}
