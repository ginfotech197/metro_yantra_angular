import { Injectable } from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {GameResult} from '../models/GameResult.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {throwError} from 'rxjs';
import {ServerResponse} from '../models/ServerResponse.model';
import {TransactionReport} from '../models/TransactionReport.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionReportService {
  private BASE_API_URL = environment.BASE_API_URL;
  // transactionData: TransactionReport[] = [];

  constructor(private http: HttpClient ) { }

  getTransactionByUser(transactionId){

    return this.http.post(this.BASE_API_URL + '/getRechargeDetails', transactionId).pipe(catchError(this.handleError),
      tap(((response: {success: number, data: TransactionReport[]}) => {
        // this.transactionData = response.data;
        // console.log(this.transactionData);
      })));
  }

  // getTransactionByUserId(transactionId){
  //
  //   return this.http.post(this.BASE_API_URL + '/dev/getTransactionByUser', transactionId).pipe(catchError(this.handleError),
  //     tap(((response: {success: number, data: TransactionReport[]}) => {
  //       // this.transactionData = response.data;
  //       // console.log(this.transactionData);
  //     })));
  // }

  private handleError(errorResponse: HttpErrorResponse){
    if (errorResponse.error.message.includes('1062')){
      return throwError('Record already exists');
    }else {
      return throwError(errorResponse.error.message);
    }
  }
}
