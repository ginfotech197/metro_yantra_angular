import { Component, OnInit } from '@angular/core';
import { GameType } from 'src/app/models/GameType.model';
import { AuthService } from 'src/app/services/auth.service';
import {GameTypeService} from '../../../services/game-type.service';
import {environment} from '../../../../environments/environment';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';
import {PayoutSettingService} from '../../../services/payout-setting.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-payout-setting',
  templateUrl: './payout-setting.component.html',
  styleUrls: ['./payout-setting.component.scss']
})
export class PayoutSettingComponent implements OnInit {
  isProduction = environment.production;
  showDevArea = false;
  gameTypes: GameType[] = [];
  updatedGameType = null;

  multiplexer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  saveButton = false;

  screenWidth: any;  
  screenHeight: any; 

  displayedColumns = ['position', 'gameTypeName', 'mrp', 'winningPrice', 'commission', 'payout'];
  public dataSource: MatTableDataSource<GameType>;

  // tslint:disable-next-line:max-line-length
  constructor(private gameTypeService: GameTypeService, private payoutSettingService: PayoutSettingService ,  private authService: AuthService) {
    
    this.screenWidth = window.innerWidth;  
    this.screenHeight = window.innerHeight;

    this.gameTypes = this.gameTypeService.getGameType();
    this.gameTypeService.getGameTypeListener().subscribe((response: GameType[]) => {
      this.gameTypes = response;
      // tslint:disable-next-line:max-line-length
      this.gameTypes = this.gameTypes.filter(x => x.gameTypeId === 1 || x.gameTypeId === 3 || x.gameTypeId === 4 || x.gameTypeId === 6 || x.gameTypeId === 7 || x.gameTypeId === 10);
      // this.dataSource = new MatTableDataSource(this.gameTypes);
    });
    this.gameTypes = this.gameTypes.filter(x => x.gameTypeId === 1 || x.gameTypeId === 3 || x.gameTypeId === 4 || x.gameTypeId === 6 || x.gameTypeId === 7 || x.gameTypeId === 10);
    // this.dataSource = new MatTableDataSource(this.gameTypes);
    // tslint:disable-next-line:max-line-length
    // this.gameTypes = this.gameTypes.filter(x => x.gameTypeId === 1 || x.gameTypeId === 3 || x.gameTypeId === 4 || x.gameTypeId === 6|| x.gameTypeId === 7|| x.gameTypeId === 8|| x.gameTypeId === 9);

    this.updatedGameType = setInterval(() => {
      this.gameTypeService.getUpdatedGameTypes();
    }, 10000);
  }

  ngOnDestroy() {
    clearInterval(this.updatedGameType);
  }


  ngOnInit(): void {
    // this.multiplexer = 1;
  }

  updateAutoMultiplexer(id, multiplexer, active){

    this.gameTypeService.updateAutoMultiplexer(id, multiplexer, active).subscribe();
  }

  updateAllPayout(){
    let x = 0;
    const masterData = [];
    for (x = 0; x < (this.gameTypes.length); x++){
      masterData.push({gameTypeId : this.gameTypes[x].gameTypeId, newPayout: this.gameTypes[x].payout, multiplexer: this.gameTypes[x].multiplexer, counter: this.gameTypes[x].counter});
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to update payout?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update It!'
    }).then((result) => {
      if (result.isConfirmed){
        this.gameTypeService.updatePayout(masterData).subscribe(response => {
          if (response.success === 1){
            const responseData = response.data;
            // @ts-ignore
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Payout updated',
              showConfirmButton: false,
              timer: 1000
            });
            // updating terminal balance from here

          }else{
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

    // gameTypeId, newPayout: payout, multiplexer
  }

  updatePayout(gameTypeId, payout, multiplexer){


    if (multiplexer > 10){
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Invalid multiplexer',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to update payout?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update It!'
    }).then((result) => {
      if (result.isConfirmed){
        // tslint:disable-next-line:max-line-length
        const masterData = [];
        // for (const data of this.gameTypes) {
        //   masterData.push({gameTypeId: data.gameTypeId, newPayout: data.payout});
        // }
        masterData.push({gameTypeId, newPayout: payout, multiplexer});
        this.gameTypeService.updatePayout(masterData).subscribe(response => {
          if (response.success === 1){
            const responseData = response.data;
            // @ts-ignore
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Payout updated',
              showConfirmButton: false,
              timer: 1000
            });
            // updating terminal balance from here

          }else{
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
}
