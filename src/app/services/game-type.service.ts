import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ErrorService} from './error.service';
import {ServerResponse} from '../models/ServerResponse.model';
import { GameType } from '../models/GameType.model';
import {environment} from '../../environments/environment';
import { Subject } from 'rxjs';
import {PayoutSetting} from "../models/PayoutSetting.model";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class GameTypeService {
  private BASE_API_URL = environment.BASE_API_URL;
  gameTypes: GameType[] = [];
  gameTypeSubject = new Subject<GameType[]>();

  constructor(private  http: HttpClient, private errorService: ErrorService) {
    this.http.get(this.BASE_API_URL + '/gameTypes').subscribe((response: ServerResponse) => {
      this.gameTypes = response.data;
      this.gameTypeSubject.next([...this.gameTypes]);
    });
  }

  getGameType(){
    return [...this.gameTypes];
  }

  getGameTypeListener(){
    return this.gameTypeSubject.asObservable();
  }

  getUpdatedGameTypes(){
    this.http.get(this.BASE_API_URL + '/gameTypes').subscribe((response: ServerResponse) => {
      this.gameTypes = response.data;
      this.gameTypeSubject.next([...this.gameTypes]);
    });
  }

  updateAutoMultiplexer(id, multiplexer, active){
    return this.http.put<PayoutSetting>(this.BASE_API_URL + '/cPanel/game/autoMultiplexer', {gameTypeId: id, multiplexer, active})
      .pipe(catchError(this.errorService.serverError), tap(response => {
        // @ts-ignore
        this.gameTypes = response.data;
        this.gameTypeSubject.next([...this.gameTypes]);
      }));
  }

  updatePayout(gameType){
    return this.http.put<PayoutSetting>(this.BASE_API_URL + '/cPanel/game/payout', gameType)
      .pipe(catchError(this.errorService.serverError), tap(response => {
        // @ts-ignore
        this.gameTypes = response.data;
        this.gameTypeSubject.next([...this.gameTypes]);
      }));
  }

}
