import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ServerResponse} from '../models/ServerResponse.model';
import {SingleNumber} from '../models/SingleNumber.model';
import {TwelveCard} from '../models/TwelveCard.model';
import {SixteenCard} from '../models/SixteenCard.model';

import {Subject} from 'rxjs';
import {NumberCombinations} from '../models/NumberCombinations.model';
import {catchError, tap} from 'rxjs/operators';
import {ErrorService} from './error.service';
import {GameInputSaveResponse} from '../models/GameInputSaveResponse.model';
import {DoubleNumber} from '../models/DoubleNumber.model';
import {GameResult} from '../models/GameResult.model';
import {CurrentGameResult} from '../models/CurrentGameResult.model';
import {TodayLastResult} from '../models/TodayLastResult.model';
import {User} from '../models/user.model';
import {AuthService} from './auth.service';
import {AndarNumber} from "../models/AndarNumber.model";
import {BaharNumber} from "../models/BaharNumber.model";



@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class PlayGameService {
  singleNumbers: SingleNumber[] = [];
  singleNumberSubject = new Subject<SingleNumber[]>();
  numberCombinationMatrix: NumberCombinations[] = [];
  numberCombinationMatrixSubject = new Subject<NumberCombinations[]>();
  currentDateResult: CurrentGameResult;
  currentDateResultSubject = new Subject<CurrentGameResult>();

  todayLastResult: TodayLastResult;
  todayLastResultSubject = new Subject<TodayLastResult>();
  // activeDrawTime: DrawTime;
  // activeDrawTimeSubject = new Subject<DrawTime>();
  private BASE_API_URL = environment.BASE_API_URL;
  user: User;
  doubleNumbers: DoubleNumber[] = [];
  doubleNumberSubject = new Subject<DoubleNumber[]>();

  twelveCard: TwelveCard[] = [];
  twelveCardSubject = new Subject<any[]>();

  sixteenCard: SixteenCard[] = [];
  sixteenCardSubject = new Subject<SixteenCard[]>();

  andaarNumber: AndarNumber[] = [];
  AndaarNumberSubject = new Subject<AndarNumber[]>();

  baharNumber: BaharNumber[] = [];
  BaharNumberSubject = new Subject<BaharNumber[]>();






  constructor(private http: HttpClient, private errorService: ErrorService, private authService: AuthService) {

    const userData: User =  JSON.parse(localStorage.getItem('user'));
    // console.log('play game service calling', userData);
    if (userData !== null){
      // get single numbers
      this.http.get(this.BASE_API_URL + '/unity/getSingleNumber').subscribe((response: ServerResponse) => {
        this.singleNumbers = response.data;
        // console.log(this.singleNumbers);
        this.singleNumberSubject.next([...this.singleNumbers]);
      });

      this.http.get(this.BASE_API_URL + '/numberCombinations/matrix').subscribe((response: ServerResponse) => {
        this.numberCombinationMatrix = response.data;
        this.numberCombinationMatrixSubject.next([...this.numberCombinationMatrix]);
      });

      this.http.get(this.BASE_API_URL + '/dev/results/currentDate').subscribe((response: ServerResponse) => {
        this.currentDateResult = response.data;
        this.currentDateResultSubject.next({...this.currentDateResult});
      });

      this.http.get(this.BASE_API_URL + '/getDoubleNumber').subscribe((response: ServerResponse) => {
        this.doubleNumbers = response.data;
        // console.log(this.doubleNumbers);
        this.doubleNumberSubject.next([...this.doubleNumbers]);
      });

      this.http.get(this.BASE_API_URL + '/getTwelveCards').subscribe((response: ServerResponse) => {
        this.twelveCard = response.data;
        // console.log(this.doubleNumbers);
        this.twelveCardSubject.next([...this.twelveCard]);
      });

      this.http.get(this.BASE_API_URL + '/getSixteenCards').subscribe((response: ServerResponse) => {
        this.sixteenCard = response.data;
        // console.log(this.doubleNumbers);
        this.sixteenCardSubject.next([...this.sixteenCard]);
      });
      this.http.get(this.BASE_API_URL + '/getAndarNumbers').subscribe((response: ServerResponse) => {
        this.andaarNumber = response.data;
        this.AndaarNumberSubject.next([...this.andaarNumber]);
      });

      this.http.get(this.BASE_API_URL + '/getBaharNumbers').subscribe((response: ServerResponse) => {
        this.baharNumber = response.data;
        this.BaharNumberSubject.next([...this.baharNumber]);
      });
    }


    // get active draw
    //   this.http.get(this.BASE_API_URL + '/drawTimes/active').subscribe((response: ServerResponse) => {
    //     this.activeDrawTime = response.data;
    //     this.activeDrawTimeSubject.next({...this.activeDrawTime});
    //   });

  }

  getBaharNumber(){
    return [...this.baharNumber];
  }
  getBaharNumberListener(){
    return this.BaharNumberSubject.asObservable();
  }

  getAndaarNumber(){
    return [...this.andaarNumber];
  }
  getAndaarNumberListener(){
    return this.AndaarNumberSubject.asObservable();
  }

  getSixteenCard(){
    return [...this.sixteenCard];
  }
  getSixteenCardListener(){
    return this.sixteenCardSubject.asObservable();
  }

  getTwelveCard(){
    return [...this.twelveCard];
  }
  getTwelveCardListener(){
    return this.twelveCardSubject.asObservable();
  }

  getSingleNumbers(){
    return [...this.singleNumbers];
  }
  getSingleNumberListener(){
    return this.singleNumberSubject.asObservable();
  }

  getDoubleNumbers(){
    return [...this.doubleNumbers];
  }
  getDoubleNumberListener(){
    return this.doubleNumberSubject.asObservable();
  }

  getNumberCombinationMatrix(){
    return [...this.numberCombinationMatrix];
  }
  getNumberCombinationMatrixListener(){
    return this.numberCombinationMatrixSubject.asObservable();
  }

  getCurrentDateResult(){
    return {...this.currentDateResult};
  }
  getCurrentDateResultListener(){
    return this.currentDateResultSubject.asObservable();
  }
  // getActiveDrawTime(){
  //   return {...this.activeDrawTime};
  // }
  // getActiveDrawTimeListener(){
  //   return this.activeDrawTimeSubject.asObservable();
  // }

  saveUserPlayInputDetails(inputData){
    return this.http.post<GameInputSaveResponse>(this.BASE_API_URL + '/buyTicket', inputData)
      .pipe(catchError(this.errorService.serverError), tap(response => {
        console.log('service ', response);
    }));
  }

  getTodayResult(){
    this.http.get(this.BASE_API_URL + '/dev/results/currentDate').subscribe((response: ServerResponse) => {
      this.currentDateResult = response.data;
      this.currentDateResultSubject.next({...this.currentDateResult});
    });
  }

  getTodayLastResult(){
    this.http.get<TodayLastResult>(this.BASE_API_URL + '/results/lastResult').subscribe(response => {
      this.todayLastResult = response;
      this.todayLastResultSubject.next({...this.todayLastResult});
    });
  }

  getTodayLastResultListener(){
    return this.todayLastResultSubject.asObservable();
  }
}
