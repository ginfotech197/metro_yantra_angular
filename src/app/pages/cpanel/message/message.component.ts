import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ServerResponse } from 'http';
import { throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  messageForm: UntypedFormGroup;
  messages: any;
  private BASE_API_URL = environment.BASE_API_URL;
  progress: number;
  progress1: number;
  progress2: number;
  progress3: number;


  constructor(private http: HttpClient, private errorService: ErrorService) {
    this.messageForm = new UntypedFormGroup({
      id: new UntypedFormControl(null),
      message : new UntypedFormControl(null),

    });
   }

  ngOnInit(): void {


    this.http.get(this.BASE_API_URL + '/message' ).subscribe((response: {success: number, data: any}) => {
     this.messages= response.data;
    });
  }

  onSubmitMessage(){
     this.http.post(this.BASE_API_URL + '/message', {message : this.messageForm.value.message})
      .subscribe((response : {success: number, data: any}) => {
        if (response.success == 1) {
          this.messageForm.reset();
          this.messages = response.data;
        }
      });

    // return this.http.post(this.BASE_API_URL + '/message', messageValue)
    //   .pipe(catchError(this.handleError), tap(((response: { success: number, data: any[] }) => {
    //     // if (response.data) {
    //       this.messages = response.data;
    //       console.log(this.messages);
    //     // }
    //   })));

  }

  onChangeWNP(event: Event) {

    // @ts-ignore
    const x = event.target.files[0];
    const formData = new FormData();
    // const fineName = x.name + '.zip';
    const fineName = 'Metro_Yantra_NonPrintVersion.zip';
    formData.append('file', x);
    formData.append('fileName', fineName);
    // const upload = this.http.post(this.BASE_API_URL + '/uploadFile', formData).subscribe(() => {
    // });
    this.progress = 1;
    this.http
      .post(this.BASE_API_URL + '/uploadFile', formData, {
        reportProgress: true,
        observe: "events"
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.progress = null;
          }
        }),
        catchError((err: any) => {
          this.progress = null;
          alert(err.message);
          return throwError(err.message);
        })
      )
      .toPromise().then(r => {});
  }

  onChangeANP(event: Event) {
    // @ts-ignore
    const x = event.target.files[0];
    const formData = new FormData();
    // const fineName = x.name + '.zip';
    const fineName = 'Metro_Yantra_NonPrintVersion.apk';
    formData.append('file', x);
    formData.append('fileName', fineName);
    // const upload = this.http.post(this.BASE_API_URL + '/uploadFile', formData).subscribe(() => {
    // });
    this.progress1 = 1;
    this.http
      .post(this.BASE_API_URL + '/uploadFile', formData, {
        reportProgress: true,
        observe: "events"
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress1 = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.progress1 = null;
          }
        }),
        catchError((err: any) => {
          this.progress1 = null;
          alert(err.message);
          return throwError(err.message);
        })
      )
      .toPromise().then(r => {});
  }

  onChangeWPV(event: Event) {
    // @ts-ignore
    const x = event.target.files[0];
    const formData = new FormData();
    // const fineName = x.name + '.zip';
    const fineName = 'Metro_Yantra_PrintVersion.zip';
    formData.append('file', x);
    formData.append('fileName', fineName);
    // const upload = this.http.post(this.BASE_API_URL + '/uploadFile', formData).subscribe(() => {
    // });
    this.progress2 = 1;
    this.http
      .post(this.BASE_API_URL + '/uploadFile', formData, {
        reportProgress: true,
        observe: "events"
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress2 = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.progress2 = null;
          }
        }),
        catchError((err: any) => {
          this.progress2 = null;
          alert(err.message);
          return throwError(err.message);
        })
      )
      .toPromise().then(r => {});
  }

  onChangeAPV(event: Event) {
    // @ts-ignore
    const x = event.target.files[0];
    const formData = new FormData();
    // const fineName = x.name + '.zip';
    const fineName = 'Metro_Yantra_PrintVersion.apk';
    formData.append('file', x);
    formData.append('fileName', fineName);
    // const upload = this.http.post(this.BASE_API_URL + '/uploadFile', formData).subscribe(() => {
    // });
    this.progress3 = 1;
    this.http
      .post(this.BASE_API_URL + '/uploadFile', formData, {
        reportProgress: true,
        observe: "events"
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress3 = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.progress3 = null;
          }
        }),
        catchError((err: any) => {
          this.progress3 = null;
          alert(err.message);
          return throwError(err.message);
        })
      )
      .toPromise().then(r => {});
  }

  upload(file) {
    this.progress = 1;
    const formData = new FormData();
    const fineName = 'Metro_Yantra_PrintVersion.apk';
    formData.append('file', file);
    formData.append('fileName', fineName);
    this.http
      .post(this.BASE_API_URL + '/uploadFile', formData, {
        reportProgress: true,
        observe: "events"
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.progress = null;
          }
        }),
        catchError((err: any) => {
          this.progress = null;
          alert(err.message);
          return throwError(err.message);
        })
      )
      .toPromise().then(r => {});
  }


  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error.message.includes('1062')) {
      return throwError('Record already exists');
    } else {
      return throwError(errorResponse.error.message);
    }
  }

}
