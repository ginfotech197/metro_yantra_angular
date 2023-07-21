import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/Game.model';
import { User } from 'src/app/models/user.model';
import { TurnOver } from 'src/app/models/TurnOver.model';
import { Terminal } from 'src/app/models/Terminal.model';
import { StockistReportService } from 'src/app/services/stockist-report.service';
import { MasterTerminalService } from 'src/app/services/master-terminal.service';
import { GameService } from 'src/app/services/game.service';
import Swal from 'sweetalert2';
import { AdminReportService } from 'src/app/services/admin-report.service';
import { CPanelBarcodeReport } from 'src/app/models/CPanelBarcodeReport.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


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


  games: Game[];
  terminalPin: null;

  userData: User;

  turnOverReportRecords: any[] = [];
  copyTurnOverReportRecords: any[] = [];


  turnOverreport: TurnOver;

  terminals: Terminal[] = [];


  stockistTurnOverReport: TurnOver[] = [];
  terminalTurnOverReport: TurnOver[] = [];

  stockistTurnOverReportEnabled = true;
  terminalTurnOverReportEnabled = false;

  terminalBarcodeTurnOverReportEnabled = false;

  superStockistToggle = 0;
  superStockistSearch = null;



  barcodeReportRecords: CPanelBarcodeReport[] = [];
  private BASE_API_URL = environment.BASE_API_URL;


  constructor(private stockistReportService: StockistReportService, private masterTerminalService: MasterTerminalService, private gameService: GameService, private adminReportService: AdminReportService, private http: HttpClient) {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {
    this.games = this.gameService.getGame();
    this.gameService.getGameListener().subscribe((response: Game[]) => {
      this.games = response;
    });


    this.terminals = this.masterTerminalService.getTerminals();
    this.masterTerminalService.getTerminalListener().subscribe((response: Terminal[]) => {
      this.terminals = response;
    });
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
    // console.log("test");
    const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
    const endDate = this.pipe.transform(this.EndDateFilter, 'yyyy-MM-dd');
    this.stockistReportService.turnOverReport(startDate, endDate, this.userData.userId).subscribe((response) => {
      if (response.success === 1) {
        Swal.close();
        this.turnOverreport = response.data;
        this.stockistTurnOverReportEnabled = true;
        this.terminalTurnOverReportEnabled = false;
        this.terminalBarcodeTurnOverReportEnabled = false;
      }
    });
  }



  searchTerminal() {
    this.userData = JSON.parse(localStorage.getItem('user'));


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
    this.adminReportService.adminTerminalOverStockist(startDate, endDate, this.userData.userId).subscribe((response) => {
      if (response.data) {
        Swal.close();
        this.terminalTurnOverReport = response.data;
        this.stockistTurnOverReportEnabled = false;
        this.terminalTurnOverReportEnabled = true;
      }
    });
  }

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
      Swal.close();
      // @ts-ignore
      this.barcodeReportRecords = response.data;
      this.terminalTurnOverReportEnabled = false;
      this.stockistTurnOverReportEnabled = false;
      this.terminalBarcodeTurnOverReportEnabled = true;
    });
  }

  revertBack() {
    if (this.terminalTurnOverReportEnabled === true) {
      this.terminalTurnOverReportEnabled = false;
      this.stockistTurnOverReportEnabled = true;
      this.terminalBarcodeTurnOverReportEnabled = false;
    } else if (this.stockistTurnOverReportEnabled === true) {
      this.terminalTurnOverReportEnabled = false;
      this.stockistTurnOverReportEnabled = false;
      this.terminalBarcodeTurnOverReportEnabled = false;
    } else if (this.terminalBarcodeTurnOverReportEnabled === true) {
      this.terminalTurnOverReportEnabled = true;
      this.stockistTurnOverReportEnabled = false;
      this.terminalBarcodeTurnOverReportEnabled = false;
    }
  }
  onToggleSuperStockist(event){
    this.superStockistToggle = event.checked === true ? 1 : 0;
  }

}
