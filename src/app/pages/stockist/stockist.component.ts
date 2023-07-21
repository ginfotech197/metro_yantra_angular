import { Component, OnInit } from '@angular/core';
import { NgxPrinterService } from 'ngx-printer';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { MasterStockistService } from 'src/app/services/master-stockist.service';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-stockist',
  templateUrl: './stockist.component.html',
  styleUrls: ['./stockist.component.scss']
})
export class StockistComponent implements OnInit {

  gameData: any[] = [];
  user: User;
  test = null;
  currentTime: any;

  grandBet = 0;
  grandWin = 0;
  grandProfit = 0;




  constructor(private ngxPrinterService: NgxPrinterService, private authService: AuthService, private masterStockistService: MasterStockistService, private commonService: CommonService) {
    this.user = this.authService.userBehaviorSubject.value;

    // this.games = this.gameService.getGame();
    // this.gameService.getGameListener().subscribe((response: Game[]) => {
    //   this.games = response;
    // });

    this.gameData = this.masterStockistService.getGameData();
    this.masterStockistService.getGameDataListener().subscribe((response) => {
      this.gameData = response;
      this.grandBet = this.gameData[0].total_bet + this.gameData[1].total_bet + this.gameData[2].total_bet + this.gameData[3].total_bet + this.gameData[4].total_bet + this.gameData[5].total_bet;
      this.grandWin = this.gameData[0].total_win + this.gameData[1].total_win + this.gameData[2].total_win + this.gameData[3].total_win + this.gameData[4].total_win + this.gameData[5].total_win;
      this.grandProfit = this.gameData[0].profit + this.gameData[1].profit + this.gameData[2].profit + this.gameData[3].profit + this.gameData[4].profit + this.gameData[5].profit;
    });

    // this.grandBet = this.gameData[0].total_bet + this.gameData[1].total_bet + this.gameData[2].total_bet + this.gameData[3].total_bet + this.gameData[4].total_bet;
    // this.grandWin = this.gameData[0].total_win + this.gameData[1].total_win + this.gameData[2].total_win + this.gameData[3].total_win + this.gameData[4].total_win;
    // this.grandProfit = this.gameData[0].profit + this.gameData[1].profit + this.gameData[2].profit + this.gameData[3].profit + this.gameData[4].profit;

    this.test = setInterval(() => {
      this.masterStockistService.getRefreshedGameData();
    }, 5000);

    this.commonService.currentTimeBehaviorSubject.asObservable().subscribe((response) => {
      this.currentTime = response;
    });
  }

  ngOnDestroy() {
    clearInterval(this.test);
  }

  ngOnInit(): void {

  }

}
