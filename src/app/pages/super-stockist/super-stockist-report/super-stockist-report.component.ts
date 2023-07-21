import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {CPanelBarcodeReport} from '../../../models/CPanelBarcodeReport.model';
import {BarcodeDetails} from '../../../models/BarcodeDetails.model';
import {CPanelCustomerSaleReport} from '../../../models/CPanelCustomerSaleReport.model';
import {DatePipe} from '@angular/common';
import {User} from '../../../models/user.model';
import {SuperStockistReportService} from '../../../services/super-stockist-report.service';
import Swal from 'sweetalert2';
import { Terminal } from 'src/app/models/Terminal.model';
import { MasterTerminalService } from 'src/app/services/master-terminal.service';
import { Game } from 'src/app/models/Game.model';
import { GameService } from 'src/app/services/game.service';
import { AdminReportService } from 'src/app/services/admin-report.service';

@Component({
  selector: 'app-super-stockist-report',
  templateUrl: './super-stockist-report.component.html',
  styleUrls: ['./super-stockist-report.component.scss']
})
export class SuperStockistReportComponent implements OnInit {

  thisYear = new Date().getFullYear();
  thisMonth = new Date().getMonth();
  thisDay = new Date().getDate();
  startDate = new Date(this.thisYear, this.thisMonth, this.thisDay);

  maxDate = new Date(this.thisYear, this.thisMonth, this.thisDay);
  minDate = new Date(this.thisYear, this.thisMonth, this.thisDay-30);

  isProduction = environment.production;
  showDevArea = false;
  barcodeReportRecords: CPanelBarcodeReport[] = [];
  copyBarcodeReportRecords: CPanelBarcodeReport[] = [];
  barcodeDetails: BarcodeDetails;
  customerSaleReportRecords: CPanelCustomerSaleReport[] = [];

  StartDateFilter = this.startDate;
  EndDateFilter = this.startDate;
  pipe = new DatePipe('en-US');

  totalAmount = 0;
  columnNumber = 4;
  selectedReport = '0';
  userData: User;
  gameId: null;
  terminalPin: null;

  terminals: Terminal[] = [];
  games: Game[];

  columnNumber1=8;
  p = 1;
  p1 = 1;
  itemsOnEveryPage = 10;
  terminalFilter = null;
  searchItem = null;

  claimed_prize_value = 0;
  end_point = 0;
  unclaimed_prize_value = 0;
  totalWinPrizeValue = 0;
  stockist_commission = 0;
  commission = 0;

  ntp = 0;

  


  constructor(private adminReportService: AdminReportService, private superStockistReportService: SuperStockistReportService, private masterTerminalService: MasterTerminalService,  private gameService: GameService) {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {

    console.log(this.minDate);
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

    this.searchByDateTab1();
    this.searchByDateTab2();
    this.barcodeReportRecords = this.superStockistReportService.getBarcodeReportRecords();
    this.copyBarcodeReportRecords = this.superStockistReportService.getBarcodeReportRecords();
    this.superStockistReportService.getBarcodeReportListener().subscribe((response: CPanelBarcodeReport[]) => {
      this.barcodeReportRecords = response;
      this.copyBarcodeReportRecords = response;
    });

    this.customerSaleReportRecords = this.superStockistReportService.getCustomerSaleReportRecords();
    this.superStockistReportService.getCustomerSaleReportListener().subscribe((response: CPanelCustomerSaleReport[]) => {
      this.customerSaleReportRecords = response;
      let temp = 0;
      let totalWinPrizeValue = 0;
      let claimed_prize_value = 0;
      let unclaimed_prize_value = 0;
      let stockist_commission = 0;
      let commission = 0;
      let ntp = 0;

      this.customerSaleReportRecords.forEach(function(value) {
        temp += Number(value.total);
        totalWinPrizeValue += Number(value.claimed_prize_value) + Number(value.unclaimed_prize_value);
        claimed_prize_value += Number(value.claimed_prize_value);
        unclaimed_prize_value += Number(value.unclaimed_prize_value);
        stockist_commission += Number(value.stockist_commission);
        commission += Number(value.commission);
        ntp += Number(value.total)-Number(value.commission)-Number(value.claimed_prize_value);
      });
      // console.log('total amount' + temp);
      this.totalAmount = temp;
      this.totalAmount = Number(temp.toFixed(2));
      this.totalWinPrizeValue = Number(totalWinPrizeValue.toFixed(2));
      this.end_point = this.totalAmount - this.totalWinPrizeValue;
      this.claimed_prize_value = Number(claimed_prize_value.toFixed(2));
      this.unclaimed_prize_value = Number(unclaimed_prize_value.toFixed(2));
      this.stockist_commission = Number(stockist_commission.toFixed(2));
      this.commission = Number(commission.toFixed(2));      
      this.ntp = this.totalAmount-this.commission-this.claimed_prize_value;
    });
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
    this.superStockistReportService.customerSaleReportByDate(startDate, endDate, this.userData.userId).subscribe((response) => {
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
    this.superStockistReportService.barcodeReportByDate(startDate, endDate, this.userData.userId).subscribe((response) => {
      if (response.data){
        Swal.close();
      }
    });
  }


  openPopup(playMasterId: number, barcodeNumber: string){

    this.adminReportService.getBarcodeDetails(playMasterId).subscribe(response => {
      this.barcodeDetails = response.data;
      console.log(this.barcodeDetails);
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
