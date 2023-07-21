import { Injectable } from '@angular/core';
import {SuperStockist} from '../models/SuperStockist.model';
import {HttpClient} from '@angular/common/http';
import {ErrorService} from './error.service';
import {ServerResponse} from '../models/ServerResponse.model';
import {Subject} from 'rxjs';
import {Stockist} from '../models/Stockist.model';
import {environment} from '../../environments/environment';
import {StockistMaster} from '../models/StockistMaster.model';
import {catchError, tap} from 'rxjs/operators';
import {MasterStockistService} from "./master-stockist.service";

@Injectable({
  providedIn: 'root'
})
export class MasterSuperStockistService {

  private BASE_API_URL = environment.BASE_API_URL;
  superStockists: SuperStockist[] = [];
  stockists: StockistMaster[] = [];
  superStockistSubject = new Subject<SuperStockist[]>();
  stockistSubject = new Subject<StockistMaster[]>();

  gameData: any[]=[];
  masterSuperStockistGameDataSubject = new Subject<any[]>();

  User = JSON.parse(localStorage.getItem('user'));

  constructor(private http: HttpClient, private errorService: ErrorService, private masterStockistService: MasterStockistService) {

    // const User = JSON.parse(localStorage.getItem('user'));

    this.http.get(this.BASE_API_URL + '/superStockists').subscribe((response: ServerResponse) => {
      this.superStockists = response.data;
      this.superStockistSubject.next([...this.superStockists]);
    });

    this.http.get(this.BASE_API_URL + '/superStockist/gameTotalReportToday/' + this.User.userId).subscribe((response: ServerResponse) => {
      this.gameData = response.data;
      // console.log(this.gameData);
      this.masterSuperStockistGameDataSubject.next([...this.gameData]);
    });
  }

  getRefreshedGameData(){
    this.http.get(this.BASE_API_URL + '/superStockist/gameTotalReportToday/' + this.User.userId).subscribe((response: ServerResponse) => {
      this.gameData = response.data;
      // console.log(this.gameData);
      this.masterSuperStockistGameDataSubject.next([...this.gameData]);
    });
  }

  getGameData(){
    // this.http.get(this.BASE_API_URL + '/dev/gameTotalReportToday').subscribe((response: ServerResponse) => {
    //   this.gameData = response.data;
    //   this.gameDataSubject.next([...this.gameData]);
    // });
    return [...this.gameData];
  }

  getAllUpdatedSuperStockist(){
    this.http.get(this.BASE_API_URL + '/superStockists').subscribe((response: ServerResponse) => {
      this.superStockists = response.data;
      this.superStockistSubject.next([...this.superStockists]);
    });
  }

  saveSuperStockist(superStockist){
    return this.http.post<StockistMaster>(this.BASE_API_URL + '/superStockists', superStockist)
      .pipe(catchError(this.errorService.serverError), tap(response => {
        this.superStockists.unshift(response.data);
        this.superStockistSubject.next([...this.superStockists]);
      }));
  }

  updateSuperStockist(superStockist){
    return this.http.put<StockistMaster>(this.BASE_API_URL + '/superStockists', superStockist)
      .pipe(catchError(this.errorService.serverError), tap(response => {
        const x = this.superStockists.findIndex(x => x.userId === response.data.userId);
        this.superStockists[x] = response.data;
        this.superStockistSubject.next([...this.superStockists]);
      }));
  }

  getStockistBySuperStockistId(id){
    this.http.get(this.BASE_API_URL + '/getStockistBySuperStockistId/' + id).subscribe((response: ServerResponse) => {
      this.stockists = response.data;
      this.stockistSubject.next([...this.stockists]);
    });
  }

  getStockistBySuperStockistIdListener(){
    return this.stockistSubject.asObservable();
  }

  saveSuperStockistBalance(superStockist){
    return this.http.put<StockistMaster>(this.BASE_API_URL + '/superStockists/balance', superStockist)
      .pipe(catchError(this.errorService.serverError), tap(response => {
        this.masterStockistService.getAllLatestStockist();
        const targetSuperStockistIndex = this.superStockists.findIndex(x => x.userId === response.data.userId);
        this.superStockists[targetSuperStockistIndex] = response.data;
        this.superStockistSubject.next([...this.superStockists]);
      }));
  }

  getSuperStockists(){
    return [...this.superStockists];
  }

  getSuperStockistListener(){
    return this.superStockistSubject.asObservable();
  }
  getStockistListener(){
    return this.stockistSubject.asObservable();
  }

  getGameDataListener(){
    return this.masterSuperStockistGameDataSubject.asObservable();
  }

  updateBlock(superStockists){
    return this.http.post<any>(this.BASE_API_URL + '/updateBlock', {id: superStockists})
      .pipe(catchError(this.errorService.serverError), tap(response => {

        // tslint:disable-next-line:no-shadowed-variable

        // const x = this.superStockists.findIndex(x => x.userId === response.data.userId);
        // this.superStockists[x] = response.data;
        // this.superStockistSubject.next([...this.superStockists]);

        // this.terminals.unshift(response.data);
        // this.terminalSubject.next([...this.terminals]);

        const targetSuperStockistIndex = this.superStockists.findIndex(x => x.userId === response.data.userId);
        this.superStockists[targetSuperStockistIndex] = response.data;
        this.superStockistSubject.next([...this.superStockists]);
      }));
  }
}
