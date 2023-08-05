import { Component, OnInit } from '@angular/core';
import { CurrentGameResult } from 'src/app/models/CurrentGameResult.model';
import { ResultService } from 'src/app/services/result.service';
import {GameResult} from '../../../models/GameResult.model';
import {GameResultService} from '../../../services/game-result.service';
import {Game} from '../../../models/Game.model';
import {GameService} from '../../../services/game.service';

import { DatePipe } from '@angular/common';

import {  VERSION } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { ServerResponse } from 'src/app/models/ServerResponse.model';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  abcd : any;
  date: any;

  thisYear = new Date().getFullYear();
  thisMonth = new Date().getMonth();
  thisDay = new Date().getDate();
  startDate = new Date(this.thisYear, this.thisMonth, this.thisDay);

  StartDateFilter = this.startDate;
  EndDateFilter = this.startDate;

  currentDateResult: CurrentGameResult;
  resultList: GameResult[] = [];
  selectedDateResult: any;


  currentDate: string;
  columnNumber = 12;
  columnNumber2 = 7;
  columnNumber3 = 1;
  public activeTripleContainerValue = 0;

  selectedGame: number;
  todayResult: GameResult[] = [];
  games: Game[];
  buttonColours: string = '#0047AB';
  buttonColour = ['#0047AB', '#009900', '#CC0033', '#9900CC'];
  todayResultAutoRefreshControl = null;

  today: String = new Date().toLocaleString();
  pipe = new DatePipe('en-US');

  userSub: Subscription;
  public user: User;
  isAuthenticated = false;
  isAdmin = false;
  isDeveloper = false;
  isStockist = false;
  isSuperStockist = false;
  isTerminal = false;

  screenWidth: any;  
  screenHeight: any; 




  constructor(private resultService: ResultService, private gameResultService: GameResultService ,private gameService: GameService, private authService: AuthService) {
    this.screenWidth = window.innerWidth;  
    this.screenHeight = window.innerHeight;
    console.log(this.screenWidth);
   }

  ngOnInit(): void {

    

    this.userSub = this.authService.userBehaviorSubject.subscribe(user => {
      if (user){
        this.user = user;
        this.isAuthenticated = user.isAuthenticated;
        this.isAdmin = user.isAdmin;
        this.isDeveloper = user.isDeveloper;
        this.isStockist = user.isStockist;
        this.isTerminal = user.isTerminal;
        this.isSuperStockist = user.isSuperStockist;
      }else{
        this.isAuthenticated = false;
        this.isAdmin = false;
        this.isDeveloper = false;
        this.isStockist = false;
        this.isTerminal = false;
        this.isSuperStockist = false;
      }
    });
    // console.log(this.isAuthenticated);




    this.currentDateResult = this.resultService.getCurrentDateResult();
    this.resultService.getCurrentDateResultListener().subscribe((response: CurrentGameResult) => {
      this.currentDateResult = response;
    });

    this.selectedGame = 1;

    this.resultService.getTodayResultByGameId(this.selectedGame);
    this.resultService.getTodayResultByGameIdListener().subscribe((response) => {
      this.todayResult = response;
    });

    this.resultList = this.gameResultService.getResultList();
    this.gameResultService.getResultListListener().subscribe((response: GameResult[]) => {
      this.resultList = response;
    });

    this.games = this.gameService.getGame();
    this.gameService.getGameListener().subscribe((response: Game[]) => {
      this.games = response;
    });

    this.todayResultAutoRefreshControl = setInterval(() => {
      this.resultService.getTodayResultByGameId(this.selectedGame);
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.todayResultAutoRefreshControl);
  }

  isActiveTripleContainter(idxSingle: number) {
    // tslint:disable-next-line:triple-equals
    return this.activeTripleContainerValue == idxSingle;
  }

  

  setActiveGame(gameData) {
    // console.log(gameData);
    // this.gameResultService.getSelectedGamedResult(data);
    this.selectedGame = gameData.id;
    // console.log(this.selectedGame);
    this.resultService.getTodayResultByGameId(this.selectedGame);
    // this.gameResultService.getSelectedGamedResult(this.selectedGame);
    // this.bgColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    this.buttonColours = this.buttonColour[gameData.id - 1];
  }
  searchResultByDate(){
    
    const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
    this.resultService.getTodayResultByGameId(startDate).subscribe((response) => {
      // @ts-ignore
      this.todayResult = response.data;
      console.log(this.todayResult);
    });
    
    
    
    
  }




}
