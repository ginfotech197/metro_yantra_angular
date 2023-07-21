import { Component, OnInit } from '@angular/core';
import { NgxPrinterService, PrintItem } from 'ngx-printer';
import { ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ngxPrintMarkerPosition } from 'ngx-printer';
import { ReceiptComponent } from './receipt/receipt.component';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/models/Game.model';
import {DrawTime} from '../../models/DrawTime.model';
import {CommonService} from '../../services/common.service';
import {ChartComponent} from 'ng-apexcharts';
import {any} from 'codelyzer/util/function';
import {ApexNonAxisChartSeries, ApexResponsive, ApexChart} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};


@Component({
  selector: 'app-cpanel',
  templateUrl: './cpanel.component.html',
  styleUrls: ['./cpanel.component.scss']
})
export class CpanelComponent implements OnInit {
  @ViewChild('PrintTemplate')
  private PrintTemplateTpl: TemplateRef<any>;

  @ViewChild(ReceiptComponent, { read: ElementRef })
  PrintComponent: ElementRef;

  printWindowSubscription: Subscription;
  $printItems: Observable<PrintItem[]>;
  user: User;
  currentTime: any;

  games: Game[];
  gameData: any[] = [];
  selectedGame = null;
  test = null;
  grandBet = 0;
  grandWin = 0;
  grandProfit = 0;

  screenWidth: any;  
  screenHeight: any; 


//
// export type ChartOptions = {
//     series: ApexNonAxisChartSeries;
//     chart: ApexChart;
//     responsive: ApexResponsive[];
//     labels: any;
//   };
//
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;



  constructor(private ngxPrinterService: NgxPrinterService, private authService: AuthService, private gameService: GameService, private commonService: CommonService) {

    this.screenWidth = window.innerWidth;  
    this.screenHeight = window.innerHeight;
    
    this.chartOptions = {
      series: [44, 55, 13],
      chart: {
        width: 380,
        type: "donut"
      },
      labels: ["Total Bet", "Total Win", "Profit"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.printWindowSubscription = this.ngxPrinterService.$printWindowOpen.subscribe(
      val => {
        console.log('Print window is open:', val);
      }
    );
    this.$printItems = this.ngxPrinterService.$printItems;

    this.test = setInterval(() => {
      this.gameService.getRefreshGameData();
    }, 5000);

    // this.activeDrawTime = this.commonService.getActiveDrawTime();
    this.commonService.currentTimeBehaviorSubject.asObservable().subscribe((response) => {
      this.currentTime = response;
    });
  }

  ngOnInit(): void {
    this.user = this.authService.userBehaviorSubject.value;

    this.games = this.gameService.getGame();
    this.gameService.getGameListener().subscribe((response: Game[]) => {
      this.games = response;
    });

    this.gameData = this.gameService.getGameData();
    this.gameService.getGameDataListener().subscribe((response) => {
      this.gameData = response;
      this.grandBet = this.gameData[0].total_bet + this.gameData[1].total_bet + this.gameData[2].total_bet + this.gameData[3].total_bet + this.gameData[4].total_bet + this.gameData[5].total_bet;
      this.grandWin = this.gameData[0].total_win + this.gameData[1].total_win + this.gameData[2].total_win + this.gameData[3].total_win + this.gameData[4].total_win + this.gameData[5].total_win;
      this.grandProfit = this.gameData[0].profit + this.gameData[1].profit + this.gameData[2].profit + this.gameData[3].profit + this.gameData[4].profit + this.gameData[5].profit;
      this.chartOptions.series = [this.grandBet, this.grandWin, this.grandProfit];
    });

    this.grandBet = this.gameData[0].total_bet + this.gameData[1].total_bet + this.gameData[2].total_bet + this.gameData[3].total_bet + this.gameData[4].total_bet + this.gameData[5].total_bet;
    this.grandWin = this.gameData[0].total_win + this.gameData[1].total_win + this.gameData[2].total_win + this.gameData[3].total_win + this.gameData[4].total_win + this.gameData[5].total_win;
    this.grandProfit = this.gameData[0].profit + this.gameData[1].profit + this.gameData[2].profit + this.gameData[3].profit + this.gameData[4].profit + this.gameData[5].profit;
    this.chartOptions.series = [this.grandBet, this.grandWin, this.grandProfit];


  }

  ngOnDestroy() {
    clearInterval(this.test);
  }

  printDiv() {
    this.ngxPrinterService.printOpenWindow = false;
    this.ngxPrinterService.printDiv('printDiv');
    this.ngxPrinterService.printOpenWindow = false;
  }

  printTemplate() {
    this.ngxPrinterService.printAngular(this.PrintTemplateTpl);
  }

  printHTMLElementToCurrentWithCustomCSS() {
    this.ngxPrinterService.printOpenWindow = false;
    this.ngxPrinterService.renderClass = 'current-window';
    this.ngxPrinterService.printHTMLElement(this.PrintComponent.nativeElement);
    this.ngxPrinterService.printOpenWindow = true;
    this.ngxPrinterService.renderClass = 'default';
  }

  printerMarkerClicked() {
    alert('Print marker clicked');
  }

  changeAutoGenerate(x) {
    this.gameService.updateAutogenertate(x.id);
  }

  activateGame(x) {
    this.gameService.activateActive(x.id);
  }
}
