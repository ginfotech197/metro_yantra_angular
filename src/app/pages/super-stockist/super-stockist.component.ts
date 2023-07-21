import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxPrinterService, PrintItem } from 'ngx-printer';
import { Observable, Subscription } from 'rxjs';
import { Game } from 'src/app/models/Game.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';
import { MasterSuperStockistService } from 'src/app/services/master-super-stockist.service';
import { ReceiptComponent } from '../cpanel/receipt/receipt.component';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-super-stockist',
  templateUrl: './super-stockist.component.html',
  styleUrls: ['./super-stockist.component.scss']
})
export class SuperStockistComponent implements OnInit {

  @ViewChild('PrintTemplate')
  private PrintTemplateTpl: TemplateRef<any>;

  @ViewChild(ReceiptComponent, { read: ElementRef })
  PrintComponent: ElementRef;

  printWindowSubscription: Subscription;
  $printItems: Observable<PrintItem[]>;
  user: User;

  games: Game[];
  gameData: any[] = [];
  selectedGame = null;
  test = null;
  currentTime: any;

  grandBet = 0;
  grandWin = 0;
  grandProfit = 0;

  constructor(private ngxPrinterService: NgxPrinterService, private authService: AuthService, private masterSuperStockistService: MasterSuperStockistService, private commonService: CommonService) {
    this.printWindowSubscription = this.ngxPrinterService.$printWindowOpen.subscribe(
      val => {
        console.log('Print window is open:', val);
      }
    );
    this.$printItems = this.ngxPrinterService.$printItems;

    this.test = setInterval(() => {
      this.masterSuperStockistService.getRefreshedGameData();
    }, 5000);

    this.commonService.currentTimeBehaviorSubject.asObservable().subscribe((response) => {
      this.currentTime = response;
    });

  }

  ngOnInit(): void {

    this.user = this.authService.userBehaviorSubject.value;

    // this.games = this.gameService.getGame();
    // this.gameService.getGameListener().subscribe((response: Game[]) => {
    //   this.games = response;
    // });

    this.gameData = this.masterSuperStockistService.getGameData();
    this.masterSuperStockistService.getGameDataListener().subscribe((response) => {
      this.gameData = response;
      this.grandBet = this.gameData[0].total_bet + this.gameData[1].total_bet + this.gameData[2].total_bet + this.gameData[3].total_bet + this.gameData[4].total_bet + this.gameData[5].total_bet;
      this.grandWin = this.gameData[0].total_win + this.gameData[1].total_win + this.gameData[2].total_win + this.gameData[3].total_win + this.gameData[4].total_win + this.gameData[5].total_win;
      this.grandProfit = this.gameData[0].profit + this.gameData[1].profit + this.gameData[2].profit + this.gameData[3].profit + this.gameData[4].profit + + this.gameData[5].profit;
    });

    this.grandBet = this.gameData[0].total_bet + this.gameData[1].total_bet + this.gameData[2].total_bet + this.gameData[3].total_bet + this.gameData[4].total_bet + this.gameData[5].total_bet;
    this.grandWin = this.gameData[0].total_win + this.gameData[1].total_win + this.gameData[2].total_win + this.gameData[3].total_win + this.gameData[4].total_win + this.gameData[5].total_win;
    this.grandProfit = this.gameData[0].profit + this.gameData[1].profit + this.gameData[2].profit + this.gameData[3].profit + this.gameData[4].profit + + this.gameData[5].profit;


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
    // console.log(this.PrintTemplateTpl);
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

  // changeAutoGenerate(x){
  //   this.gameService.updateAutogenertate(x.id);
  // }

  // activateGame(x){
  //   this.gameService.activateActive(x.id);
  // }

}
