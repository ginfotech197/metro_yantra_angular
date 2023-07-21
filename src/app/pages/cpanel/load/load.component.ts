import { Component, OnInit } from '@angular/core';
import {AdminReportService} from '../../../services/admin-report.service';
import {Terminal} from '../../../models/Terminal.model';
import {MasterTerminalService} from '../../../services/master-terminal.service';
import {Game} from '../../../models/Game.model';
import {GameService} from '../../../services/game.service';
import {DrawTime} from '../../../models/DrawTime.model';
import {ServerResponse} from '../../../models/ServerResponse.model';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SingleNumber} from '../../../models/SingleNumber.model';
import {DoubleNumber} from '../../../models/DoubleNumber.model';
import {NumberCombinations} from "../../../models/NumberCombinations.model";
import {TwelveCard} from "../../../models/TwelveCard.model";
import {SixteenCard} from "../../../models/SixteenCard.model";
import {AndarNumber} from "../../../models/AndarNumber.model";
import {BaharNumber} from "../../../models/BaharNumber.model";
import Swal from "sweetalert2";


@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss']
})
export class LoadComponent implements OnInit {
  loadReports: any;
  terminals: Terminal[] = [];
  sortedTerminalList: Terminal[] = [];
  terminalId = null;
  gameId = null;
  drawId = null;
  games: Game[];
  drawTimes: DrawTime[] = [];
  private BASE_API_URL = environment.BASE_API_URL;

  singleNumber: SingleNumber[] = [];
  doubleNumber: DoubleNumber[] = [];
  numberCombinationMatrix: NumberCombinations[] = [];
  twelveCard: TwelveCard[] = [];
  sixteenCard: SixteenCard[] = [];
  singleNumberIndividual: SingleNumber[] = [];
  doubleNumberIndividual: DoubleNumber[] = [];
  andaarNumber: AndarNumber[] = [];
  baharNumber: BaharNumber[] = [];

  columnNumber = 40;
  columnNumber2 = 40;
  columnNumber3 = 300;
  columnNumber4 = 10;
  allDrawTimes: DrawTime[] = [];



  constructor(private adminReportService: AdminReportService
              , private masterTerminalService: MasterTerminalService
              , private gameService: GameService
              , private http: HttpClient
  ) { }

  ngOnInit(): void {

    this.gameId = 1;

    // this.user = this.authService.userBehaviorSubject.value;
    this.terminals = this.masterTerminalService.getTerminals();
    this.sortedTerminalList = this.masterTerminalService.getTerminals();
    this.masterTerminalService.getTerminalListener().subscribe((response: Terminal[]) => {
      this.terminals = response;
      this.sortedTerminalList = response;
      // console.log(this.sortedTerminalList);
    });



    this.games = this.gameService.getGame();
    this.gameService.getGameListener().subscribe((response: Game[]) => {
      this.games = response;
    });

    this.gameService.getDrawTimes(this.gameId);
    this.gameService.getDrawTimesListener().subscribe((response: DrawTime[]) => {
      this.allDrawTimes = response;
    });

  }

  fetchDrawTime(){
    this.gameService.getDrawTimes(this.gameId);
  }


  onSearch(){

    if (this.drawId == null){
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
      game_id: this.gameId,
      draw_id: this.drawId,
    };

    this.adminReportService.getLoadReports(loadData).subscribe((response) => {
      this.loadReports = response.data;

      if ('single_number' in this.loadReports){
          this.singleNumber = this.loadReports.single_number;
          this.doubleNumber = this.loadReports.double_number;
          this.numberCombinationMatrix = this.loadReports.triple_number;

          this.twelveCard = [];
          this.sixteenCard = [];
          this.singleNumberIndividual = [];
          this.doubleNumberIndividual = [];
          this.andaarNumber = [];
          this.baharNumber = [];
      }else if ('twelve_card' in this.loadReports){
          this.twelveCard = this.loadReports.twelve_card;

          this.singleNumber = [];
          this.doubleNumber = [];
          this.numberCombinationMatrix = [];
          this.sixteenCard = [];
          this.singleNumberIndividual = [];
          this.doubleNumberIndividual = [];
          this.andaarNumber = [];
          this.baharNumber = [];
      }else if ('sixteen_card' in this.loadReports){
          this.sixteenCard = this.loadReports.sixteen_card;

          this.singleNumber = [];
          this.doubleNumber = [];
          this.numberCombinationMatrix = [];
          this.twelveCard = [];
          this.singleNumberIndividual = [];
          this.doubleNumberIndividual = [];
          this.andaarNumber = [];
          this.baharNumber = [];

      }else if ('single_individual' in this.loadReports){
          this.singleNumberIndividual = this.loadReports.single_individual;

          this.singleNumber = [];
          this.doubleNumber = [];
          this.numberCombinationMatrix = [];
          this.twelveCard = [];
          this.sixteenCard = [];
          this.doubleNumberIndividual = [];
          this.andaarNumber = [];
          this.baharNumber = [];

      }else if ('double_individual' in this.loadReports){
          this.doubleNumberIndividual = this.loadReports.double_individual;
          this.andaarNumber = this.loadReports.andar_number;
          this.baharNumber = this.loadReports.bahar_number;

          this.singleNumber = [];
          this.doubleNumber = [];
          this.numberCombinationMatrix = [];
          this.twelveCard = [];
          this.sixteenCard = [];
          this.singleNumberIndividual = [];
      }
    });
  }

}
