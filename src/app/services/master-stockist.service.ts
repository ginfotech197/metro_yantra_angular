import { Injectable } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { StockistMaster } from '../models/StockistMaster.model';
import { ServerResponse } from '../models/ServerResponse.model';
import { Stockist } from '../models/Stockist.model';
import { Subject } from 'rxjs';
import { User } from "../models/user.model";
import { MasterTerminalService } from "./master-terminal.service";
import { TerminalMaster } from "../models/TerminalMaster.model";

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class MasterStockistService {

  private BASE_API_URL = environment.BASE_API_URL;
  masterStockistForm: UntypedFormGroup;
  stockists: Stockist[] = [];
  user: User;
  stockistSubject = new Subject<Stockist[]>();
  // stockits: Stockist[] = [];

  User = JSON.parse(localStorage.getItem('user'));

  gameData: any[]=[];
  masterStockistGameDataSubject = new Subject<any[]>();

  constructor(private http: HttpClient, private errorService: ErrorService, private masterTerminalService: MasterTerminalService) {
    this.masterStockistForm = new UntypedFormGroup({
      id: new UntypedFormControl(null),
      stockistName: new UntypedFormControl(null, [Validators.required]),
      loginId: new UntypedFormControl(null),
    });
    const User = JSON.parse(localStorage.getItem('user'));
    // get all stockists
    // this.http.get(this.BASE_API_URL + '/stockists/'+ User.userId ).subscribe((response: ServerResponse) => {
    this.http.get(this.BASE_API_URL + '/stockists').subscribe((response: ServerResponse) => {
      this.stockists = response.data;
      this.stockistSubject.next([...this.stockists]);
    });


    this.http.get(this.BASE_API_URL + '/stockist/gameTotalReportToday/' + this.User.userId).subscribe((response: ServerResponse) => {
      this.gameData = response.data;
      // console.log(this.gameData);
      this.masterStockistGameDataSubject.next([...this.gameData]);
    });

  }

  getRefreshedGameData(){
    this.http.get(this.BASE_API_URL + '/stockist/gameTotalReportToday/' + this.User.userId).subscribe((response: ServerResponse) => {
      this.gameData = response.data;
      // console.log(this.gameData);
      this.masterStockistGameDataSubject.next([...this.gameData]);
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
    return this.masterStockistGameDataSubject.asObservable();
  }

  getAllLatestStockist() {
    this.http.get(this.BASE_API_URL + '/stockists').subscribe((response: ServerResponse) => {
      this.stockists = response.data;
      this.stockistSubject.next([...this.stockists]);
    });
  }


  //  stockistSubject = new Subject<Stockist[]>();

  getStockists() {
    return [...this.stockists];
  }
  getStockistListener() {
    return this.stockistSubject.asObservable();
  }

  updateStockiist(stockist) {
    return this.http.put<StockistMaster>(this.BASE_API_URL + '/stockists', stockist)
      .pipe(catchError(this.errorService.serverError), tap(response => {
        // tslint:disable-next-line:no-shadowed-variable
        const x = this.stockists.findIndex(x => x.userId === response.data.userId);
        this.stockists[x] = response.data;
        this.stockistSubject.next([...this.stockists]);
      }));
  }

  saveNewStockist(stockist) {
    return this.http.post<StockistMaster>(this.BASE_API_URL + '/stockists', stockist)
      .pipe(catchError(this.errorService.serverError), tap(response => {
        this.stockists.unshift(response.data);
        this.stockistSubject.next([...this.stockists]);
      }));
  }

  saveStockistBalance(stockist) {
    return this.http.put<StockistMaster>(this.BASE_API_URL + '/stockists/balance', stockist)
      .pipe(catchError(this.errorService.serverError), tap(response => {
        this.masterTerminalService.getAllUpdatedTerminals();
        const targetStockistIndex = this.stockists.findIndex(x => x.userId === response.data.userId);
        this.stockists[targetStockistIndex] = response.data;
        this.stockistSubject.next([...this.stockists]);
      }));
  }


  updateBlock(stockist) {
    // return this.http.post<StockistMaster>(this.BASE_API_URL + '/updateBlock', {id: stockist})
    //   .pipe(catchError(this.errorService.serverError), tap(response => {
    //
    //     // tslint:disable-next-line:no-shadowed-variable
    //
    //     // const x = this.stockits.findIndex(x => x.userId === response.data.userId);
    //     // this.stockits[x] = response.data;
    //     // this.stockistSubject.next([...this.stockits]);
    //
    //     // this.terminals.unshift(response.data);
    //     // this.terminalSubject.next([...this.terminals]);
    //   }));

    return this.http.post<StockistMaster>(this.BASE_API_URL + '/updateBlock', { id: stockist })
      .pipe(catchError(this.errorService.serverError), tap(response => {

        const targetStockistIndex = this.stockists.findIndex(x => x.userId === response.data.userId);
        this.stockists[targetStockistIndex] = response.data;
        this.stockistSubject.next([...this.stockists]);
      }));
  }
}
