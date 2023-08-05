import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DrawTime } from '../../../models/DrawTime.model';
import { ManualResultService } from '../../../services/manual-result.service';
import { SingleNumber } from '../../../models/SingleNumber.model';
import { PlayGameService } from '../../../services/play-game.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { DatePipe, formatDate } from '@angular/common';
import { ServerResponse } from '../../../models/ServerResponse.model';
import { HttpClient } from '@angular/common/http';
import { MatCard } from '@angular/material/card';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { CommonService } from '../../../services/common.service';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/models/Game.model';
import { AdminReportService } from 'src/app/services/admin-report.service';
import { GameInputLoad } from 'src/app/models/GameInputLoad.model';
import { DoubleNumber } from '../../../models/DoubleNumber.model';
import { NumberCombinations } from '../../../models/NumberCombinations.model';
import { TwelveCard } from 'src/app/models/TwelveCard.model';
import { SixteenCard } from 'src/app/models/SixteenCard.model';
import { ErrorService } from 'src/app/services/error.service';
import { Terminal } from 'src/app/models/Terminal.model';
import { MasterTerminalService } from 'src/app/services/master-terminal.service';
import { AndarNumber } from 'src/app/models/AndarNumber.model';
import { BaharNumber } from 'src/app/models/BaharNumber.model';
// import {DoubleNumber} from '../models/DoubleNumber.model';

// import { Moment } from 'moment';
// const moment = _moment;

@Component({
  selector: 'app-manual-result',
  templateUrl: './manual-result.component.html',
  styleUrls: ['./manual-result.component.scss'],
  animations: [
    trigger('changeDivSize', [
      state('initial', style({
        backgroundColor: 'green',
        width: '100px',
        height: '100px'
      })),
      state('final', style({
        backgroundColor: 'red',
        width: '200px',
        height: '200px'
      })),
      transition('initial=>final', animate('1500ms')),
      transition('final=>initial', animate('1000ms'))
    ]),
  ]
})
export class ManualResultComponent implements OnInit {
  private BASE_API_URL = environment.BASE_API_URL;
  manualResultForm: UntypedFormGroup;
  oldDateResultForm: UntypedFormGroup;
  drawTimes: DrawTime[] = [];
  public numberCombinationMatrix: NumberCombinations[] = [];
  private copyNumberMatrix: SingleNumber[];
  currentCombinationMatrixSelectedId: number;
  currentState = 'initial';
  private validatorError: any;
  isProduction = environment.production;
  showDevArea = false;
  deviceXs: boolean;
  isDisabledSingleHeaderButton = true;
  selectedGame: number;

  manualResultSaveArray: any[] = [];

  // showing
  singleNumberVisible = null;
  doubleNumberVisible = null;
  tripleNumberVisible = null;
  singleIndividualNumberVisible = null;
  doubleIndividualNumberVisible = null;
  twelveSelectedCard = null;
  sixteenSelectedCard = null;

  thisYear = new Date().getFullYear();
  thisMonth = new Date().getMonth();
  thisDay = new Date().getDate();
  startDate = new Date(this.thisYear, this.thisMonth, this.thisDay);

  StartDateFilter = this.startDate;
  newDateFilter = this.startDate;
  EndDateFilter = this.startDate;
  pipe = new DatePipe('en-US');

  oldDateReultDrawTime: any;

  selectedNumberCombination = null;
  requestedData = [];

  columnNumber = 10;
  columnNumber2 = 20;
  columnNumber3 = 200;
  columnNumber4 = 10;
  // columnNumber = 10;

  singleNumber: SingleNumber[] = [];
  twelveCard: TwelveCard[] = [];
  sixteenCard: SixteenCard[] = [];


  // gameTypes : any;

  games: Game[];

  doubleNumber: DoubleNumber[] = [];

  inputLoad: GameInputLoad[];
  totalSale: any[];

  sortedTerminalList: Terminal[] = [];
  terminalId = null;
  terminals: Terminal[] = [];
  loadReports: any;
  singleNumberIndividual: SingleNumber[] = [];
  doubleNumberIndividual: DoubleNumber[] = [];
  andaarNumber: AndarNumber[] = [];
  baharNumber: BaharNumber[] = [];

  screenWidth: any;
  screenHeight: any;


  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, private manualResultService: ManualResultService, private gameService: GameService, private playGameService: PlayGameService, private route: ActivatedRoute, private router: Router, private commonService: CommonService, private errorService: ErrorService, private masterTerminalService: MasterTerminalService
              , private adminReportService: AdminReportService
    ) {

      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;

    this.deviceXs = this.commonService.deviceXs;
    const now = new Date();
    const currentSQLDate = formatDate(now, 'yyyy-MM-dd', 'en');
    this.manualResultForm = new UntypedFormGroup({
      id: new UntypedFormControl(null),
      drawMasterId: new UntypedFormControl(null, [Validators.required]),
      numberCombinationId: new UntypedFormControl(null, [Validators.required]),
      gameId: new UntypedFormControl(null, [Validators.required]),
      single: new UntypedFormControl(null),
      triple: new UntypedFormControl(null),
      transaction_date: new UntypedFormControl(currentSQLDate),
    });

    this.oldDateResultForm = new UntypedFormGroup({
      id: new UntypedFormControl(null),
      drawMasterId: new UntypedFormControl(null, [Validators.required]),
      numberCombinationId: new UntypedFormControl(null, [Validators.required]),
      single: new UntypedFormControl(null),
      triple: new UntypedFormControl(null),
      gameId: new UntypedFormControl(null, [Validators.required]),
      gameDate: new UntypedFormControl(this.startDate),
    });
    this.manualResultForm.patchValue({ gameId: 1 });
  }



  ngOnInit(): void {
    // this.drawTimes = this.manualResultService.getAllDrawTimes();
    // this.manualResultService.getAllDrawTimesListener().subscribe((response: DrawTime[]) => {
    //   this.drawTimes = response;
    // });


    this.manualResultForm.patchValue({ gameId: 1 });
    this.oldDateResultForm.patchValue({ gameId: 1 });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map(route => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data =>
      console.log('data', data)
    );

    this.selectedGame = 1;

    const now = new Date();
    // const currentSQLDate = formatDate(now, 'yyyy-MM-dd', 'en');
    // this.http.get(this.BASE_API_URL + '/drawTimes/dates/' + currentSQLDate).subscribe((response: ServerResponse) => {
    //     this.drawTimes = response.data;
    //   });

    this.fetchDrawTime(this.selectedGame);


    this.games = this.gameService.getGame();
    this.gameService.getGameListener().subscribe((response: Game[]) => {
      this.games = response;
    });

    this.singleNumber = this.playGameService.getSingleNumbers();
    this.playGameService.getSingleNumberListener().subscribe((response) => {
      this.singleNumber = response;
      console.log(this.singleNumber);
    });

    this.terminals = this.masterTerminalService.getTerminals();
    this.sortedTerminalList = this.masterTerminalService.getTerminals();
    this.masterTerminalService.getTerminalListener().subscribe((response: Terminal[]) => {
      this.terminals = response;
      this.sortedTerminalList = response;
    });
  }

  fetchDrawTime(gameID) {
    this.http.get(this.BASE_API_URL + '/drawTimes/dates/' + gameID).subscribe((response: ServerResponse) => {
      this.drawTimes = response.data;
    });
  }


  iscurrentCombinationMatrixSelected(id: number) {
    return (id === this.currentCombinationMatrixSelectedId);
  }

  setManualResultInForm(single: number, numberCombination) {
    // tslint:disable-next-line:max-line-length
    this.manualResultForm.patchValue({ numberCombinationId: numberCombination.numberCombinationId, single, triple: numberCombination.visibleTripleNumber });
    this.currentCombinationMatrixSelectedId = numberCombination.numberCombinationId;
  }

  setOldDateResultInForm(single: number, numberCombination) {
    // tslint:disable-next-line:max-line-length
    this.oldDateResultForm.patchValue({ numberCombinationId: numberCombination.numberCombinationId, single, triple: numberCombination.visibleTripleNumber });
    this.currentCombinationMatrixSelectedId = numberCombination.numberCombinationId;
    this.selectedNumberCombination = numberCombination.visibleTripleNumber;
    // console.log(numberCombination);
  }


  getTrippleButtonStyle() {
    return {
      'background-color': 'red !important'
    };
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  changeState() {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
  }

  changeDraw() {
    // console.log("gameId",this.manualResultForm.value.gameId);
    this.fetchDrawTime(this.manualResultForm.value.gameId);
    this.selectedGame = this.manualResultForm.value.gameId;
    this.manualResultSaveArray = [];
    this.totalSale = null;
  }

  changeTime() {
    const x = this.manualResultForm.value.drawMasterId;
    this.manualResultSaveArray.forEach(function (value) {
      value.drawMasterId = x;
    });
  }

  selectedNumber(gameType, tempNumber, visibleNumber) {
    // const data= [gameType, tempNumber];

    if (this.manualResultForm.value.drawMasterId == null) {
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Please Select Draw Time',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    this.manualResultService.totalSaleOnCurrentDraw(gameType, tempNumber).subscribe((response: ServerResponse) => {
      this.totalSale = response.data;
    });

    // return this.http.post<ServerResponse>(this.BASE_API_URL +'/totalSaleOnCurrentDraw', gameType, tempNumber)
    // .pipe(catchError(this.errorService.serverError), tap(response => {
    //   console.log(response);
    // }))


    // console.log(visibleNumber.split(''));

    if (gameType === 1){
      this.singleNumberVisible = visibleNumber;
    }
    // if (gameType === 2) {
    //   this.tripleNumberVisible = visibleNumber;
    //   this.singleNumberVisible = visibleNumber.split('')[2];
    //   this.doubleNumberVisible = visibleNumber.split('')[1] + visibleNumber.split('')[2];
    // }
    // if (gameType === 5){
    //   this.doubleNumberVisible = visibleNumber;
    // }
    // if (gameType === 6) {
    //   this.singleIndividualNumberVisible = visibleNumber;
    // }
    // if (gameType === 7) {
    //   this.doubleIndividualNumberVisible = visibleNumber;
    // }

    const val = this.manualResultSaveArray.findIndex(x => x.gameTypeId === gameType);
    console.log("val",val);
    if (val < 0) {
      const x = {
        drawMasterId: this.manualResultForm.value.drawMasterId,
        gameTypeId: gameType,
        combinationNumberId: tempNumber
      };
      this.manualResultSaveArray.push(x);
    } else {
      this.manualResultSaveArray[val].drawMasterId = this.manualResultForm.value.drawMasterId;
      this.manualResultSaveArray[val].combinationNumberId = tempNumber;
    }
  }


  saveManualResult() {
    // console.log(this.selectedGame);
    // console.log(this.manualResultForm.value.drawMasterId);
    // console.log(this.manualResultSaveArray);

    // return;

    this.validatorError = null;
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to save this result?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.manualResultService.saveManualResult(this.manualResultSaveArray).subscribe(response => {
          if (response.success === 1) {
            // @ts-ignore
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Result saved',
              showConfirmButton: false,
              timer: 1000
            });
            this.manualResultForm.reset();
            this.currentCombinationMatrixSelectedId = -1;
          } else {
            this.validatorError = response.error;
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Validation error',
              showConfirmButton: false,
              timer: 3000
            });
          }
        }, (error) => {
          // when error occured
          console.log('data saving error', error);
        });
      }
    });
  }


  saveOldDateResult() {

    const startDate = this.pipe.transform(this.newDateFilter, 'yyyy-MM-dd');
    this.oldDateResultForm.value.gameDate = startDate;
    this.validatorError = null;
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to save this result?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.manualResultService.saveOldDateResult(this.oldDateResultForm.value).subscribe(response => {
          if (response.success === 1) {
            // @ts-ignore
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Result saved',
              showConfirmButton: false,
              timer: 1000
            });
            this.oldDateResultForm.reset();
            this.selectedNumberCombination = null;
            this.currentCombinationMatrixSelectedId = -1;
            this.oldDateReultDrawTime.splice(response.data, 1);
          } else {
            this.validatorError = response.error;
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Validation error',
              showConfirmButton: false,
              timer: 3000
            });
          }
        }, (error) => {
          // when error occured
          console.log('data saving error', error);
        });
      }
    });
  }

  getDrawTimeForOldResult(event) {
    const selectedDateForOldResult = this.pipe.transform(event.value, 'yyyy-MM-dd');
    const currentDate = this.pipe.transform(this.startDate, 'yyyy-MM-dd');
    if (selectedDateForOldResult < currentDate) {
      const requestedData = {
        gameId: this.oldDateResultForm.value.gameId,
        gameDate: this.pipe.transform(selectedDateForOldResult, 'yyyy-MM-dd'),
      };
      this.manualResultService.fetchRemainingDrawTimesToPutOldResult(requestedData).subscribe(response => {
        this.oldDateReultDrawTime = response.data;
      });
    } else {
      this.oldDateReultDrawTime = [];
    }

  }

  getGameInputLoad() {
    const requestedData = {
      gameId: this.manualResultForm.value.gameId,
      drawId: this.manualResultForm.value.drawMasterId,
    };
    this.manualResultService.showInputLoadGameWise(requestedData).subscribe(response => {
      this.inputLoad = response.data;
    });
  }

  gameDatepickerChange($event: Event) {
    // getting game after date change
    const currentSQLDate = formatDate(this.manualResultForm.value.transaction_date, 'yyyy-MM-dd', 'en');
    this.http.get(this.BASE_API_URL + '/drawTimes/dates/' + currentSQLDate).subscribe((response: ServerResponse) => {
      this.drawTimes = response.data;
    });
  }


  searchByDateTab1() {
    Swal.fire({
      title: 'Please Wait !',
      html: 'loading ...', // add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const startDate = this.pipe.transform(this.StartDateFilter, 'yyyy-MM-dd');
    // var endDate = this.pipe.transform(this.EndDateFilter, 'yyyy-MM-dd');
    this.manualResultService.saveOldDateResult(startDate).subscribe((response) => {
      if (response.data) {
        Swal.close();
      }
    });
  }

  twelveCardInput(cardCombinationId) {
    // this.twelveSelectedCard = '../../../../assets/images/' + cardCombinationId + '.jpg';
    this.twelveSelectedCard = cardCombinationId;
  }

  sixteenCardInput(cardCombinationId) {
    // this.sixteenSelectedCard = '../../../../assets/images/' + cardCombinationId + '.jpg';
    this.sixteenSelectedCard = cardCombinationId;
  }


  onSearch(){

    // drawId: this.manualResultForm.value.drawMasterId;

    if (this.manualResultForm.value.drawMasterId == null){
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Select draw time',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    }

    const loadData = {
      terminal_id: this.terminalId,
      game_id: 1,
      draw_id: this.manualResultForm.value.drawMasterId,
    };

    this.adminReportService.getLoadReports(loadData).subscribe((response) => {
      this.loadReports = response.data;
    });
  }

}
