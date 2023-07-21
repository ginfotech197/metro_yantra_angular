import { Component, OnInit } from '@angular/core';
import { CurrentGameResult } from 'src/app/models/CurrentGameResult.model';
import { ResultService } from 'src/app/services/result.service';
import {GameResult} from '../../../models/GameResult.model';
import {GameResultService} from '../../../services/game-result.service';
import {Game} from '../../../models/Game.model';
import {GameService} from '../../../services/game.service';

import { DatePipe } from '@angular/common';

import {  VERSION } from '@angular/core';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  currentDateResult: CurrentGameResult;
  resultList: GameResult[] = [];


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


  constructor(private resultService: ResultService, private gameResultService: GameResultService ,private gameService: GameService) {
   
   }

  ngOnInit(): void {
    this.currentDateResult = this.resultService.getCurrentDateResult();
    this.resultService.getCurrentDateResultListener().subscribe((response: CurrentGameResult) => {
      this.currentDateResult = response;
      // console.log(this.currentDateResult);
    });

    this.selectedGame = 1;

    this.resultService.getTodayResultByGameId(this.selectedGame);
    // this.resultService.getTodayResultByGameId(this.selectedGame);
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




}