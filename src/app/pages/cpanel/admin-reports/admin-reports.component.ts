import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'angular-bootstrap-md';
import {AdminReportService} from '../../../services/admin-report.service';
import {environment} from '../../../../environments/environment';
import {CPanelBarcodeReport} from '../../../models/CPanelBarcodeReport.model';
import {Sort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {BarcodeDetails} from '../../../models/BarcodeDetails.model';
import {CPanelCustomerSaleReport} from '../../../models/CPanelCustomerSaleReport.model';
import {FormGroup} from '@angular/forms';
import {DatePipe, formatDate} from '@angular/common';
import {Terminal} from '../../../models/Terminal.model';
import {MasterTerminalService} from '../../../services/master-terminal.service';
import {Game} from '../../../models/Game.model';
import {GameService} from '../../../services/game.service';
import { ServerResponse } from 'http';
import { findIndex } from 'rxjs';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent implements OnInit {
  @ViewChild(ModalDirective) modal: ModalDirective;

  screenWidth: any;
  screenHeight: any;

  thisYear = new Date().getFullYear();
  thisMonth = new Date().getMonth();
  thisDay = new Date().getDate();
  startDate = new Date(this.thisYear, this.thisMonth, this.thisDay);

  isProduction = environment.production;
  showDevArea = false;
  barcodeReportRecords: CPanelBarcodeReport[] = [];
  copyBarcodeReportRecords: CPanelBarcodeReport[] = [];
  barcodeDetails: BarcodeDetails;
  customerSaleReportRecords: CPanelCustomerSaleReport[] = [];
  terminals: Terminal[] = [];
  games: Game[];
  gameId: number;
  terminalPin: null;

  StartDateFilter = this.startDate;
  EndDateFilter = this.startDate;
  pipe = new DatePipe('en-US');
  p = 1;
  p1 = 1;
  p2 = 1;

  searchItem = null;
  itemsOnEveryPage = 10;


 reportData = true;

  columnNumber = 8;

  drawReport: any[] = [];

  totalAmount = 0;
  claimed_prize_value = 0;
  end_point = 0;
  unclaimed_prize_value = 0;
  totalWinPrizeValue = 0;
  super_stockist_commission = 0;
  stockist_commission = 0;
  commission = 0;
  ntp = 0;

  seriesName= [
    ' ',
    '1st12',
    '2nd12',
    '3rd12',
    '1 to 18',
    'Even',
    'Dimond',
    'Spead',
    'odd',
    '19 to 36',
    '2to1',
    '2to1 (1)',
    '2to1 (2)'
  ];

  uniquSeriesId : any[];

  loadReports: any;

  // picker1: any;
  constructor(private adminReportService: AdminReportService, private masterTerminalService: MasterTerminalService, private gameService: GameService) {
    // console.log(this.thisDay);
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.drawWiseReport(1);
    // console.log(indexOf(this.seriesName));
  }

  ngOnInit(): void {

    // this.gameId = 0;

    this.barcodeReportRecords = this.adminReportService.getBarcodeReportRecords();
    this.copyBarcodeReportRecords = this.adminReportService.getBarcodeReportRecords();
    this.adminReportService.getBarcodeReportListener().subscribe((response: CPanelBarcodeReport[]) => {
      this.barcodeReportRecords = response;

      this.copyBarcodeReportRecords = response;
    });



    this.games = this.gameService.getGame();
    const data = {
      id: 0,
      game_name: 'All',
      auto_generate: 'yes',
      active: 'yes',
      multiplexer_random: 'no',
      inforce: 1,
      created_at: null,
      updated_at: null
    };
    this.gameService.getGameListener().subscribe((response: Game[]) => {
      this.games = response;
      // tslint:disable-next-line:no-shadowed-variable
      const data = {
        id: 0,
        game_name: 'All',
        auto_generate: 'yes',
        active: 'yes',
        multiplexer_random: 'no',
        inforce: 1,
        created_at: null,
        updated_at: null
      };
      this.games.unshift(data);
    });
    this.games.unshift(data);

    this.terminals = this.masterTerminalService.getTerminals();
    this.masterTerminalService.getTerminalListener().subscribe((response: Terminal[]) => {
      this.terminals = response;
    });

    // this.adminReportService.getLoadReports();
    this.adminReportService.getLoadReportsListener().subscribe((response) => {
      this.loadReports = response;
    });

    this.customerSaleReportRecords = this.adminReportService.getCustomerSaleReportRecords();
    this.adminReportService.getCustomerSaleReportListener().subscribe((response: CPanelCustomerSaleReport[]) => {
      this.customerSaleReportRecords = response;
      let temp = 0;
      let totalWinPrizeValue = 0;
      let claimed_prize_value = 0;
      let unclaimed_prize_value = 0;
      let super_stockist_commission = 0;
      let stockist_commission = 0;
      let commission = 0;
      let ntp = 0;
      this.customerSaleReportRecords.forEach(function(value) {
        temp += Number(value.total);
        totalWinPrizeValue += Number(value.claimed_prize_value) + Number(value.unclaimed_prize_value);
        claimed_prize_value += Number(value.claimed_prize_value);
        unclaimed_prize_value += Number(value.unclaimed_prize_value);
        super_stockist_commission += Number(value.super_stockist_commission);
        stockist_commission += Number(value.stockist_commission);
        commission += Number(value.commission);
        ntp += Number(value.total)-Number(value.commission)-Number(value.claimed_prize_value);
      });
      this.totalAmount = Number(temp.toFixed(2));
      this.totalWinPrizeValue = Number(totalWinPrizeValue.toFixed(2));
      this.end_point = this.totalAmount - this.totalWinPrizeValue;
      this.claimed_prize_value = Number(claimed_prize_value.toFixed(2));
      this.unclaimed_prize_value = Number(unclaimed_prize_value.toFixed(2));
      this.super_stockist_commission = Number(super_stockist_commission.toFixed(2));
      this.stockist_commission = Number(stockist_commission.toFixed(2));
      this.commission = Number(commission.toFixed(2));
      this.ntp = this.totalAmount-this.commission-this.claimed_prize_value;

      // console.log('total amount' + temp);
    });
    // console.log('total amount' + temp);
    // this.totalAmount = temp;
    this.searchByDateTab1();
    this.searchByDateTab2();
  }

  drawWiseReport(gameId){
    this.adminReportService.getDrawWiseReport(gameId).subscribe((response  ) => {
      // @ts-ignore
      this.drawReport = response.data;
      // console.log(this.drawReport);
    });
    // if(this.drawReport==null){
    //   this.reportData=false;
    // }
  }

  searchByDateTab1(){
    Swal.fire({
      title: 'Please Wait !',
      html: 'loading ...', // add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
    const endDate = this.pipe.transform(this.EndDateFilter, 'yyyy-MM-dd');
    this.adminReportService.customerSaleReportByDate(startDate, endDate).subscribe((response) => {
      if (response.data){
        Swal.close();
      }
    });
  }

  sortByTerminal(terminal){
    if ((this.gameId !== 0) && (this.terminalPin != null)){
      this.barcodeReportRecords =  this.copyBarcodeReportRecords.filter(x => x.game_id === this.gameId);
      this.barcodeReportRecords =  this.barcodeReportRecords.filter(x => x.terminal_pin === this.terminalPin);
    }else if (terminal != null){
      this.barcodeReportRecords =  this.copyBarcodeReportRecords.filter(x => x.terminal_pin === terminal);
    }else if (this.gameId !== 0){
      this.barcodeReportRecords =  this.copyBarcodeReportRecords.filter(x => x.game_id === this.gameId);
    }
    else{
      this.barcodeReportRecords = this.copyBarcodeReportRecords;
    }
  }

  sortByGame(){

    // console.log(this.gameId);
    //
    //
    // if (this.gameId !== 0){
    //   this.barcodeReportRecords =  this.copyBarcodeReportRecords.filter(x => x.game_id === this.gameId);
    //   console.log(this.barcodeReportRecords);
    // }
    // else{
    //   this.barcodeReportRecords = this.copyBarcodeReportRecords;
    // }


    if ((this.gameId !== 0) && (this.terminalPin != null)){
      this.barcodeReportRecords =  this.copyBarcodeReportRecords.filter(x => x.game_id === this.gameId);
      this.barcodeReportRecords =  this.barcodeReportRecords.filter(x => x.terminal_pin === this.terminalPin);
    }else if (this.gameId !== 0){
      this.barcodeReportRecords =  this.copyBarcodeReportRecords.filter(x => x.game_id === this.gameId);
    }else if (this.terminalPin){
      this.barcodeReportRecords =  this.copyBarcodeReportRecords.filter(x => x.terminal_pin === this.terminalPin);
    }
    else{
      this.barcodeReportRecords = this.copyBarcodeReportRecords;
    }
  }


  searchByDateTab2(){
    Swal.fire({
      title: 'Please Wait !',
      html: 'loading ...', // add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
    const endDate = this.pipe.transform(this.EndDateFilter, 'yyyy-MM-dd');
    this.adminReportService.barcodeReportByDate(startDate, endDate).subscribe((response) => {
      if (response.data){
        Swal.close();
      }
    });
  }

  sortData(sort: Sort) {
    const data = this.barcodeReportRecords.slice();
    if (!sort.active || sort.direction === '') {
      this.barcodeReportRecords = data;
      return;
    }
    this.barcodeReportRecords = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      const isDesc = sort.direction === 'desc';
      switch (sort.active) {
        case 'barcode_number': return compare(a.barcode_number, b.barcode_number, isAsc);
        case 'draw_time': return compare(a.draw_time, b.draw_time, isAsc);
        case 'terminal_pin': return compare(a.terminal_pin, b.terminal_pin, isAsc);
        case 'ticket_taken_time': return compare(a.ticket_taken_time, b.ticket_taken_time, isAsc);
        case 'total_quantity': return compare(a.total_quantity, b.total_quantity, isAsc);
        case 'amount': return compare(a.amount, b.amount, isAsc);
        default: return 0;
      }
    });
  }

  openPopup(playMasterId: number, barcodeNumber: string){


    this.adminReportService.getBarcodeDetails(playMasterId).subscribe(response => {

      this.barcodeDetails = response.data;
      const test = this.barcodeDetails.rolletNumber.map(x => x.series_id);
      this.uniquSeriesId =[...new Set(test)];
      // const test2= test.filter((item,index)=>test.indexOf(item===index));
    });
  }

  counter(i: number) {
    // console.log(new Array(i));
    return new Array(i);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
