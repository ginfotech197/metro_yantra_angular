import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/Game.model';
import { TurnOver } from 'src/app/models/TurnOver.model';
import { Terminal } from 'src/app/models/Terminal.model';
import { User } from 'src/app/models/user.model';
import { GameService } from 'src/app/services/game.service';
import { MasterTerminalService } from 'src/app/services/master-terminal.service';
import { SuperStockistReportService } from 'src/app/services/super-stockist-report.service';
import Swal from 'sweetalert2';
import { AdminReportService } from 'src/app/services/admin-report.service';
import { CPanelBarcodeReport } from 'src/app/models/CPanelBarcodeReport.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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

  maxDate = new Date(this.thisYear, this.thisMonth, this.thisDay);
  minDate = new Date(this.thisYear, this.thisMonth, this.thisDay-30);

  StartDateFilter = this.startDate;
  EndDateFilter = this.startDate;
  pipe = new DatePipe('en-US');
  private BASE_API_URL = environment.BASE_API_URL;



  games: Game[];
  terminalPin: null;

  userData: User;
  turnOverreport: TurnOver;

  terminals: Terminal[] = [];

  stockistOverSuperStockist: TurnOver[] = [];

  superStockistTurnOverReportEnabled = true;
  stockistTurnOverReportEnabled = false;
  terminalTurnOverReportEnabled = false;

  superStockistTurnOverReport: TurnOver[] = [];
  stockistTurnOverReport: TurnOver[] = [];
  terminalTurnOverReport: TurnOver[] = [];

  terminalBarcodeTurnOverReportEnabled = false;

  barcodeReportRecords: CPanelBarcodeReport[] = [];

  superStockistSearch = null;

  superStockistToggle = 0;


  constructor(private superStockistReportService: SuperStockistReportService, private masterTerminalService: MasterTerminalService, private gameService: GameService, private adminReportService: AdminReportService, private http: HttpClient) {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {

    // this.games = this.gameService.getGame();
    // this.gameService.getGameListener().subscribe((response: Game[]) => {
    //   this.games = response;
    // });


    this.terminals = this.masterTerminalService.getTerminals();
    this.masterTerminalService.getTerminalListener().subscribe((response: Terminal[]) => {
      this.terminals = response;
    });

  }


  onToggleSuperStockist(event){
    this.superStockistToggle = event.checked === true ? 1 : 0;
  }


  searchTurnOverReport() {
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
    this.superStockistReportService.turnOverReport(startDate, endDate, this.userData.userId).subscribe((response) => {
      if (response.success === 1) {
        Swal.close();
        this.turnOverreport = response.data;
        this.superStockistTurnOverReportEnabled = true;
        this.stockistTurnOverReportEnabled = false;
        this.terminalTurnOverReportEnabled = false;
        this.terminalBarcodeTurnOverReportEnabled=false;
      }
    });
  }


  searchStockist() {
    // this.userData = JSON.parse(localStorage.getItem('user'));

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
    this.adminReportService.adminStockistOverSuperStockist(startDate, endDate, this.userData.userId).subscribe((response) => {
      if (response.data) {
        Swal.close();
        this.stockistOverSuperStockist = response.data;
        this.superStockistTurnOverReportEnabled = false;
        this.stockistTurnOverReportEnabled = true;
      }
    });
  }


  searchTerminal(stockistData) {
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
        this.superStockistTurnOverReportEnabled = false;
        this.stockistTurnOverReportEnabled = false;
        this.terminalTurnOverReportEnabled = true;
      }
    });
  }


  // searchTerminalBarCode(terminalData){
  //   Swal.fire({
  //     title: 'Please Wait !',
  //     html: 'It may take some time....', // add html attribute if you want or remove
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading();
  //     }
  //   });
  //   const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
  //   const endDate = this.pipe.transform(this.EndDateFilter, 'yyyy-MM-dd');
  //   // @ts-ignore
  //   this.http.post(this.BASE_API_URL + '/terminal/turnOverReport', {startDate, endDate, terminalId: terminalData.terminal_id}).subscribe((response) => {
  //     Swal.close();
  //     // @ts-ignore
  //     this.barcodeReportRecords = response.data;
  //     this.terminalTurnOverReportEnabled = false;
  //     this.stockistTurnOverReportEnabled = false;
  //     this.superStockistTurnOverReportEnabled = false;
  //     this.terminalBarcodeTurnOverReportEnabled = true;
  //   });
  // }

  searchTerminalBarCode(terminalData) {
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
    this.http.post(this.BASE_API_URL + '/terminal/turnOverReport', { startDate, endDate, terminalId: terminalData.terminal_id }).subscribe((response) => {
      console.log("test");
      Swal.close();
      // @ts-ignore
      this.barcodeReportRecords = response.data;
      this.terminalTurnOverReportEnabled = false;
      this.stockistTurnOverReportEnabled = false;
      this.superStockistTurnOverReportEnabled = false;
      this.terminalBarcodeTurnOverReportEnabled = true;
    });
  }

  revertBack() {
    if (this.terminalTurnOverReportEnabled === true) {
      this.terminalTurnOverReportEnabled = false;
      this.stockistTurnOverReportEnabled = true;
      this.superStockistTurnOverReportEnabled = false;
      this.terminalBarcodeTurnOverReportEnabled = false;
    } else if (this.stockistTurnOverReportEnabled === true) {
      this.terminalTurnOverReportEnabled = false;
      this.stockistTurnOverReportEnabled = false;
      this.superStockistTurnOverReportEnabled = true;
      this.terminalBarcodeTurnOverReportEnabled = false;
    } else if (this.terminalBarcodeTurnOverReportEnabled === true) {
      this.terminalTurnOverReportEnabled = true;
      this.stockistTurnOverReportEnabled = false;
      this.superStockistTurnOverReportEnabled = false;
      this.terminalBarcodeTurnOverReportEnabled = false;
    }
  }

}
