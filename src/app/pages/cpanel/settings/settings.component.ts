import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/Game.model';
import { GameService } from 'src/app/services/game.service';
import {Dialog} from 'primeng/dialog';
import {ServerResponse} from '../../../models/ServerResponse.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import Swal from 'sweetalert2';
import {CommonService} from '../../../services/common.service';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  liveGameInterval = null;
  limeGameDrawData = null;
  gameGenerateButtonDisable: any[] = [];

  highSecurityPassword: UntypedFormGroup;

  private BASE_API_URL = environment.BASE_API_URL;
  games: Game[];
  gameData: any[] = [];
  selectedGame = null;
  passwordValidatedStatus = false;

  constructor(private commonService: CommonService, private http: HttpClient) {

    this.highSecurityPassword = new UntypedFormGroup({
      password: new UntypedFormControl(null, [Validators.required]),
    });

    this.gameGenerateButtonDisable[1] = false;
    this.gameGenerateButtonDisable[2] = false;
    this.gameGenerateButtonDisable[3] = false;
    this.gameGenerateButtonDisable[4] = false;
    this.gameGenerateButtonDisable[5] = false;
    this.gameGenerateButtonDisable[6] = false;
    this.commonService.getLiveDrawTimeSubject.subscribe((response) => {
      this.limeGameDrawData = response;
      // console.log(this.limeGameDrawData);
    });
    this.liveGameInterval = setInterval(() => {
      this.commonService.getLiveDraw();
    }, 2500);
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    clearInterval(this.liveGameInterval);
  }

  validateSettingsPassword(){
    if (this.highSecurityPassword.value.password === '900900'){
      this.passwordValidatedStatus = true;
    }else{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Invalid password',
        showConfirmButton: false,
        timer: 1000
      });
    }
  }

  clearCache(){
    this.http.get(this.BASE_API_URL + '/clearCache').subscribe((response: ServerResponse) => {
      if (response.success === 1){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cache Cleared',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }

  generateResult(gameId, gameName){

    Swal.fire({
      title: 'Confirmation',
      text: 'Want to generate result for ' + gameName + ' ?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Generate It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gameGenerateButtonDisable[gameId] = true;
        // @ts-ignore
        this.http.post(this.BASE_API_URL + '/dev/createAutoResult/' + gameId).subscribe((response: ServerResponse) => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Generated',
              showConfirmButton: false,
              timer: 1000
            });
            this.gameGenerateButtonDisable[gameId] = false;
            this.commonService.getLiveDraw();
          }
        });
      }
    });
  }

}
