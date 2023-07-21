import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ErrorService} from './error.service';
import {ServerResponse} from '../models/ServerResponse.model';
import { GameType } from '../models/GameType.model';
import {environment} from '../../environments/environment';
import { Subject } from 'rxjs';
import { Game } from '../models/Game.model';
import { DrawTime } from '../models/DrawTime.model';

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class GameService {
  private BASE_API_URL = environment.BASE_API_URL;
  gameTypes: GameType[] = [];
  games: Game[] = [];
  gameTypeSubject = new Subject<GameType[]>();
  gameSubject = new Subject<Game[]>();
  gameData: any[]=[];
  gameDataSubject = new Subject<any[]>();
  drawTimes: any;
  drawTimeSubject= new Subject<any[]>();

  constructor(private  http: HttpClient, private errorService: ErrorService) {
    // this.http.get(this.BASE_API_URL + '/gameTypes').subscribe((response: ServerResponse) => {
    //   this.gameTypes = response.data;
    //   this.gameTypeSubject.next([...this.gameTypes]);
    // });
    this.http.get(this.BASE_API_URL + '/getGame').subscribe((response: ServerResponse) =>{
      this.games = response.data;
      this.gameSubject.next([...this.games]);
    });

    this.http.get(this.BASE_API_URL + '/gameTotalReportToday').subscribe((response: ServerResponse) => {
      this.gameData = response.data;
      // console.log(this.gameData);
      this.gameDataSubject.next([...this.gameData]);
    });

    




  }

  getRefreshGameData(){
    this.http.get(this.BASE_API_URL + '/gameTotalReportToday').subscribe((response: ServerResponse) => {
      this.gameData = response.data;
      // console.log(this.gameData);
      this.gameDataSubject.next([...this.gameData]);
    });
  }

  getDrawTimes(gameId){
    this.http.get(this.BASE_API_URL + '/drawTimes/' + gameId).subscribe((response:ServerResponse) => {
      this.drawTimes = response.data;
      this.drawTimeSubject.next([...this.drawTimes]);
    });
  }
  getDrawTimesListener(){
    return this.drawTimeSubject.asObservable();
  }

  getGameType(){
    return [...this.gameTypes];
  }

  getGameTypeListener(){
    return this.gameTypeSubject.asObservable();
  }

  updateAutogenertate(gameId){
    this.http.get(this.BASE_API_URL + '/dev/updateAutoGenerate/' + gameId).subscribe((response: ServerResponse) => {
    });
  }

  activateActive(gameId){
    this.http.get(this.BASE_API_URL + '/dev/activateGame/' + gameId).subscribe((response: ServerResponse) => {
      const game = response.data;
      const index = this.games.findIndex(x => x.id === game.id);
      this.games[index] = game;
      this.gameSubject.next([...this.games]);
    });


  }

  getGameData(){
    // this.http.get(this.BASE_API_URL + '/dev/gameTotalReportToday').subscribe((response: ServerResponse) => {
    //   this.gameData = response.data;
    //   this.gameDataSubject.next([...this.gameData]);
    // });
    return [...this.gameData];
  }

  getGameDataListener(){
    return this.gameDataSubject.asObservable();
  }

  getGame(){
    return [...this.games];
  }

  getGameListener(){
    return this.gameSubject.asObservable();
  }
}
