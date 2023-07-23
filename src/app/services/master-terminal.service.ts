import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Terminal} from '../models/Terminal.model';
import {Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ErrorService} from './error.service';
import {ServerResponse} from '../models/ServerResponse.model';
import {StockistMaster} from '../models/StockistMaster.model';
import {catchError, find, tap} from 'rxjs/operators';
import {TerminalMaster} from '../models/TerminalMaster.model';
import {PayoutSlab} from '../models/PayoutSlab.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class MasterTerminalService {

  private BASE_API_URL = environment.BASE_API_URL;
  terminals: Terminal[] = [];
  payoutSlab: PayoutSlab[] = [];
  terminalSubject = new Subject<Terminal[]>();
  payoutSlabSubject = new Subject<PayoutSlab[]>();
  transactionDetails: any[]=[];


  constructor(private http: HttpClient, private errorService: ErrorService) {

    // get all terminals
    this.http.get(this.BASE_API_URL + '/terminals').subscribe((response: ServerResponse) => {
      this.terminals = response.data;
      this.terminalSubject.next([...this.terminals]);
    });

    // get all payout slabs
    this.http.get(this.BASE_API_URL + '/payoutSlabs').subscribe((response: ServerResponse) => {
      this.payoutSlab = response.data;
      this.payoutSlabSubject.next([...this.payoutSlab]);
    });
  }

  getTransactionDetails(transactionId){
    // this.http.get(this.BASE_API_URL + '/getTransaction/' + transactionId).subscribe((response: ServerResponse) => {
    //   console.log(response);
    // })

    return this.http.get(this.BASE_API_URL + '/getTransaction/'+ transactionId)
      .pipe(catchError(this.errorService.serverError), tap(response => {
        // this.transactionDetails=response.data;
        // this.terminals.unshift(response.data);
        // this.terminalSubject.next([...this.terminals]);
      }));
  }



  getAllUpdatedTerminals(){
    this.http.get(this.BASE_API_URL + '/terminals').subscribe((response: ServerResponse) => {
      this.terminals = response.data;
      this.terminalSubject.next([...this.terminals]);
    });
  }

  deleteTerminalByAdmin(id){
    

    return this.http.get(this.BASE_API_URL + '/terminals/deleteTerminal/' + id).pipe(catchError(this.handleError),
      tap(((response: ServerResponse) => {
        // @ts-ignore
        const findIndex = this.terminals.findIndex(x => x.terminalId == response.terminalId);
        this.terminals = this.terminals.splice(findIndex,1);
        this.terminalSubject.next([...this.terminals]);
      })));
    
    
  }

  forceLogoutTerminal(id){
    Swal.fire({
      title: 'Please Wait !',
      html: 'Logging out ...', // add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.http.get(this.BASE_API_URL + '/forceLogout/' + id).subscribe((response: ServerResponse) => {
        if (response.success === 1){
          this.getAllUpdatedTerminals();
          Swal.close();
        }
    });
  }


  getTerminals(){
    return [...this.terminals];
  }

  getPayoutSlabs(){
    return [...this.payoutSlab];
  }

  getTerminalListener(){
    return this.terminalSubject.asObservable();
  }

  getPayoutSlabListener(){
    return this.payoutSlabSubject.asObservable();
  }

  saveNewTerminal(terminal){
    return this.http.post<TerminalMaster>(this.BASE_API_URL + '/terminals', terminal)
      .pipe(catchError(this.errorService.serverError), tap(response => {
        this.terminals.unshift(response.data);
        this.terminalSubject.next([...this.terminals]);
      }));
  }

  updateTerminal(terminal){
    return this.http.put<TerminalMaster>(this.BASE_API_URL + '/terminals', terminal)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      // tslint:disable-next-line:no-shadowed-variable
      const x = this.terminals.findIndex(x => x.terminalId === response.data.terminalId);
      this.terminals[x] = response.data;
      this.terminalSubject.next([...this.terminals]);
    }));
  }

  saveTerminalBalance(terminal){
    return this.http.put<TerminalMaster>(this.BASE_API_URL + '/terminals/balance', terminal)
      .pipe(catchError(this.errorService.serverError), tap(response => {
        // console.log('service ', response);
      }));
  }

  updateBlock(terminal){
    return this.http.post<TerminalMaster>(this.BASE_API_URL + '/updateBlock', {id: terminal})
      .pipe(catchError(this.errorService.serverError), tap(response => {

        // tslint:disable-next-line:no-shadowed-variable
        const x = this.terminals.findIndex(x => x.terminalId === response.data.terminalId);
        this.terminals[x] = response.data;
        this.terminalSubject.next([...this.terminals]);
      }));
  }

  updateAutoClaim(terminal){
    return this.http.get<TerminalMaster>(this.BASE_API_URL + '/updateAutoClaimTerminal/' + terminal)
      .pipe(catchError(this.errorService.serverError), tap(response => {

        // tslint:disable-next-line:no-shadowed-variable
        const x = this.terminals.findIndex(x => x.terminalId === response.data.terminalId);
        this.terminals[x] = response.data;
        this.terminalSubject.next([...this.terminals]);
      }));
  }

  sendMailTransaction(data){
    return this.http.post(this.BASE_API_URL + '/mailTransaction', data)
      .pipe(catchError(this.errorService.serverError), tap(response => {
      }));
  }

  loginApprove(terminal){
    return this.http.post<TerminalMaster>(this.BASE_API_URL + '/loginApprove', {id: terminal})
      .pipe(catchError(this.errorService.serverError), tap(response => {
        if (response.success === 1){
          // this.getAllUpdatedTerminals();
          // tslint:disable-next-line:no-shadowed-variable
          const x = this.terminals.findIndex(x => x.terminalId === response.data.terminalId);
          this.terminals[x] = response.data;
          this.terminalSubject.next([...this.terminals]);
        }
        // // tslint:disable-next-line:no-shadowed-variable
        // const x = this.terminals.findIndex(x => x.terminalId === response.data.terminalId);
        // this.terminals[x] = response.data;
        // this.terminalSubject.next([...this.terminals]);
      }));
  }

  gamePermission(gameId, terminalId){
    return this.http.post<TerminalMaster>(this.BASE_API_URL + '/gamePermission', {gameId, terminalId})
      .pipe(catchError(this.errorService.serverError), tap(response => {
        // console.log(response);

        // tslint:disable-next-line:no-shadowed-variable
        const x = this.terminals.findIndex(x => x.terminalId === response.data.terminalId);
        this.terminals[x] = response.data;
        this.terminalSubject.next([...this.terminals]);
      }));
  }


  private handleError(errorResponse: HttpErrorResponse){
    if (errorResponse.error.message.includes('1062')){
      return throwError('Record already exists');
    }else {
      return throwError(errorResponse.error.message);
    }
  }

}
