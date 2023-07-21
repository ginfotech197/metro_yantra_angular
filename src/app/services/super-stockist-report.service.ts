import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from "rxjs/operators";
import { CPanelCustomerSaleReport } from "../models/CPanelCustomerSaleReport.model";
import { environment } from "../../environments/environment";
import { Subject, throwError } from "rxjs";
import { CPanelBarcodeReport } from "../models/CPanelBarcodeReport.model";
import { ServerResponse } from "../models/ServerResponse.model";

@Injectable({
  providedIn: 'root'
})
export class SuperStockistReportService {

  private BASE_API_URL = environment.BASE_API_URL;
  customerSaleReportRecords: CPanelCustomerSaleReport[] = [];
  customerSaleReportSubject = new Subject<CPanelCustomerSaleReport[]>();

  barcodeReportRecords: CPanelBarcodeReport[] = [];
  barcodeReportSubject = new Subject<CPanelBarcodeReport[]>();

  turnOverReportRecords: any[];
  turnOverReportSubject = new Subject<any>();

  constructor(private http: HttpClient) { }

  getCustomerSaleReportListener() {
    return this.customerSaleReportSubject.asObservable();
  }

  getCustomerSaleReportRecords() {
    return [...this.customerSaleReportRecords];
  }

  getBarcodeReportListener() {
    return this.barcodeReportSubject.asObservable();
  }

  getBarcodeReportRecords() {
    return [...this.barcodeReportRecords];
  }

  customerSaleReportByDate(startDate, endDate, userID) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.BASE_API_URL + '/superStockist/customerSaleReports', { startDate, endDate, userID })
      .pipe(catchError(this.handleError), tap(((response: { success: number, data: CPanelCustomerSaleReport[] }) => {
        if (response.data) {
          this.customerSaleReportRecords = response.data;
          this.customerSaleReportSubject.next([...this.customerSaleReportRecords]);
        }
      })));
  }

  barcodeReportByDate(startDate, endDate, userID) {
    return this.http.post<{ success: number; data: any }>(this.BASE_API_URL + '/superStockist/barcodeReportByDate', { startDate, endDate, userID })
      .pipe(catchError(this.handleError), tap(((response: ServerResponse) => {
        if (response.data) {
          this.barcodeReportRecords = response.data;
          this.barcodeReportSubject.next([...this.barcodeReportRecords]);
        }
      })));
  }


  turnOverReport(start_date, end_date, super_stockist_id) {
    // console.log(superStockistID);
    return this.http.post<{ success: number; data: any }>(this.BASE_API_URL + '/superStockist/turnOverReport', { start_date, end_date, super_stockist_id })
      .pipe(catchError(this.handleError), tap(((response: ServerResponse) => {
        if (response.data) {
          this.turnOverReportRecords = response.data;
          this.turnOverReportSubject.next(this.turnOverReportRecords);
        }
      })));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error.message.includes('1062')) {
      return throwError('Record already exists');
    } else {
      return throwError(errorResponse.error.message);
    }
  }

}
