import {Component, OnInit, ViewChild} from '@angular/core';
import Swal from 'sweetalert2';
import {environment} from '../../../../environments/environment';
import {CPanelBarcodeReport} from '../../../models/CPanelBarcodeReport.model';
import {BarcodeDetails} from '../../../models/BarcodeDetails.model';
import {CPanelCustomerSaleReport} from '../../../models/CPanelCustomerSaleReport.model';
import {DatePipe} from '@angular/common';
import {ModalDirective} from 'angular-bootstrap-md';
import {StockistReportService} from '../../../services/stockist-report.service';
import {User} from '../../../models/user.model';
import {Sort} from '@angular/material/sort';
import { Terminal } from 'src/app/models/Terminal.model';
import { MasterTerminalService } from 'src/app/services/master-terminal.service';
import { Game } from 'src/app/models/Game.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-stockiest-report',
  templateUrl: './stockiest-report.component.html',
  styleUrls: ['./stockiest-report.component.scss']
})
export class StockiestReportComponent implements OnInit {
  @ViewChild(ModalDirective) modal: ModalDirective;

  thisYear = new Date().getFullYear();
  thisMonth = new Date().getMonth();
  thisDay = new Date().getDate();
  startDate = new Date(this.thisYear, this.thisMonth, this.thisDay);

  maxDate = new Date(this.thisYear, this.thisMonth, this.thisDay);
  minDate = new Date(this.thisYear, this.thisMonth, this.thisDay-30);

  isProduction = environment.production;
  showDevArea = false;
  barcodeReportRecords: CPanelBarcodeReport[] = [];
  barcodeDetails: BarcodeDetails;
  customerSaleReportRecords: CPanelCustomerSaleReport[] = [];

  StartDateFilter = this.startDate;
  EndDateFilter = this.startDate;
  pipe = new DatePipe('en-US');

  totalAmount = 0;
  columnNumber = 4;
  columnNumber1 = 8;
  selectedReport = '0';
  userData: User;

  terminals: Terminal[] = [];
  terminalPin: null;
  games: Game[];


  gameId: null;
  copyBarcodeReportRecords: CPanelBarcodeReport[] = [];

  searchItem = null;
  itemsOnEveryPage = 10;
  p = 1;
  p1 = 1;
  terminalFilter = null;

  claimed_prize_value = 0;
  end_point = 0;
  unclaimed_prize_value = 0;
  totalWinPrizeValue = 0;
  commission = 0;
  ntp = 0;








  // picker1: any;
  constructor(private stockistReportService: StockistReportService, private masterTerminalService: MasterTerminalService,   private gameService: GameService) {
    // console.log(this.thisDay);
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {

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

    this.barcodeReportRecords = this.stockistReportService.getBarcodeReportRecords();
    this.stockistReportService.getBarcodeReportListener().subscribe((response: CPanelBarcodeReport[]) => {
      this.barcodeReportRecords = response;
    });

    this.customerSaleReportRecords = this.stockistReportService.getCustomerSaleReportRecords();
    this.stockistReportService.getCustomerSaleReportListener().subscribe((response: CPanelCustomerSaleReport[]) => {
      this.customerSaleReportRecords = response;
      let temp = 0;
      let totalWinPrizeValue = 0;
      let claimed_prize_value = 0;
      let unclaimed_prize_value = 0;
      let commission = 0;
      let ntp = 0;

      this.customerSaleReportRecords.forEach(function(value) {
        temp += Number(value.total);
        totalWinPrizeValue += Number(value.claimed_prize_value) + Number(value.unclaimed_prize_value);
        claimed_prize_value += Number(value.claimed_prize_value);
        unclaimed_prize_value += Number(value.unclaimed_prize_value);
        commission += Number(value.commission);
        ntp += Number(value.total)-Number(value.commission)-Number(value.claimed_prize_value);

      });
      this.totalAmount = Number(temp.toFixed(2));
      this.totalWinPrizeValue = Number(totalWinPrizeValue.toFixed(2));
      this.end_point = this.totalAmount - this.totalWinPrizeValue;
      this.claimed_prize_value = Number(claimed_prize_value.toFixed(2));
      this.unclaimed_prize_value = Number(unclaimed_prize_value.toFixed(2));
      this.commission = Number(commission.toFixed(2));
      // console.log('total amount' + temp);
      this.totalAmount = temp;
      this.ntp = this.totalAmount-this.commission-this.claimed_prize_value;

    });

    this.searchByDateTab1();
    this.searchByDateTab2();
  }

  sortByGame(){
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
    this.stockistReportService.customerSaleReportByDate(startDate, endDate, this.userData.userId).subscribe((response) => {
      if (response.data){
        Swal.close();
      }
    });
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
    this.stockistReportService.barcodeReportByDate(startDate, endDate, this.userData.userId).subscribe((response) => {
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

    this.stockistReportService.getBarcodeDetails(playMasterId).subscribe(response => {
      this.barcodeDetails = response.data;
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
