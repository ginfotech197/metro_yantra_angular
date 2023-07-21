import { Component, OnInit } from '@angular/core';
import {MasterStockistService} from '../../../services/master-stockist.service';
import {AuthService} from '../../../services/auth.service';
import {MasterSuperStockistService} from '../../../services/master-super-stockist.service';
import {User} from '../../../models/user.model';
import {Stockist} from '../../../models/Stockist.model';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {Sort} from "@angular/material/sort";
import { SuperStockist } from 'src/app/models/SuperStockist.model';
import {CommonService} from "../../../services/common.service";
import {TransactionReportService} from '../../../services/transaction-report.service';
import {TransactionReport} from '../../../models/TransactionReport.model';

@Component({
  selector: 'app-master-stockist',
  templateUrl: './master-stockist.component.html',
  styleUrls: ['./master-stockist.component.scss']
})
export class MasterStockistComponent implements OnInit {

  user: User;
  stockists: Stockist[] = [];
  sortedStockistList: Stockist[];
  stockistMasterForm: UntypedFormGroup;
  stockistLimitForm: UntypedFormGroup;
  stockistAdjustForm: UntypedFormGroup
  isStockistUpdatAble = false;
  selectedStockist: Stockist = null;
  selectedStockistTransferPoint: Stockist = null;
  public highLightedRowIndex = -1;

  superStockists: SuperStockist[] = [];
  superStockistBalance: any;
  pinCheckValidator = false;
  rechargedToID = null;

  transactionData: TransactionReport[] = [];
  p: number = 1;
  p1: number = 1;
  itemsOnEveryPage = 10;
  selectedTab = 0;



  constructor(private masterStockistService: MasterStockistService, private authService: AuthService, private masterSuperStockistService: MasterSuperStockistService, private commonService: CommonService
              , private transactionReportService: TransactionReportService
  ) {
    this.user = this.authService.userBehaviorSubject.value;
    this.authService.userBehaviorSubject.subscribe((response) => {
      this.user = response;
    });
    // console.log(this.user.balance);
  }

  ngOnInit(): void {

    const userData: User = JSON.parse(localStorage.getItem('user'));
    // this.superStockistBalance = this.superStockists;

    this.stockistMasterForm = new UntypedFormGroup({
      id: new UntypedFormControl(null),
      userName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      superStockistId: new UntypedFormControl(null, [Validators.required]),
      pin: new UntypedFormControl(null, [Validators.required]),
      commission: new UntypedFormControl(null, [Validators.required, Validators.max(this.user.commission)]),
    });

    this.stockistMasterForm.patchValue({superStockistId: userData.userId});

    this.stockistLimitForm = new UntypedFormGroup({
      beneficiaryUid: new UntypedFormControl(null, [Validators.required]),
      amount: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
    });

    this.stockistAdjustForm = new UntypedFormGroup({
      beneficiaryUid: new UntypedFormControl(null, [Validators.required]),
      amount: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
    });

    this.superStockists = this.masterSuperStockistService.getSuperStockists();
    this.masterSuperStockistService.getSuperStockistListener().subscribe((response) => {
      this.superStockists = response;
    });

    this.stockists = this.masterStockistService.getStockists();
    // this.sortedStockistList = this.masterStockistService.getStockists();
    this.masterStockistService.getStockistListener().subscribe((response: Stockist[]) => {
      this.stockists = response;
      // @ts-ignore
      this.sortedStockistList = this.stockists.filter(x => x.superStockistId === this.user.userId);
    });
    this.sortedStockistList = this.stockists.filter(x => x.superStockistId === this.user.userId);
  }

  refreshStockistList(){
    this.masterStockistService.getAllLatestStockist();
  }

  updateBlock(value){
    this.masterStockistService.updateBlock(value).subscribe();
  }

  getTransaction(){
    const transactionDetail = {
      rechargedToID: this.rechargedToID,
      rechargedByID: this.user.userId
    };

    this.transactionReportService.getTransactionByUser(transactionDetail).subscribe((response) => {
      this.transactionData = response.data;
    });
  }

  onStockistSelect(event: any){
    this.selectedStockist = this.stockists.find(x => x.userId === event.value);
    console.log(event);
  }

  onStockistSelectAdjustPoint(event: any){
    this.selectedStockistTransferPoint = this.stockists.find(x => x.userId === event.value);
  }

  checkPinValidation(){
    this.commonService.checkPinValidation(this.stockistMasterForm.value.userName).subscribe((response) => {
      // @ts-ignore
      if (response.success === 0){
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Pin already exists',
          showConfirmButton: false,
          timer: 2000
        });
        this.pinCheckValidator = true;
        this.stockistMasterForm.patchValue({userName: null});
      }else{
        this.pinCheckValidator = false;
      }
    });
  }


  rechargeToStockist() {

    if(parseInt(this.stockistLimitForm.value.amount) < 0){
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Amount cannot be negative',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if ((this.selectedStockistTransferPoint.superStockistBalance) < this.stockistLimitForm.value.amount){
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Insufficient balance',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to recharge?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, recharge It!'
    }).then((result) => {
      if (result.isConfirmed){
        const masterData = {
          beneficiaryUid: this.stockistLimitForm.value.beneficiaryUid,
          amount: this.stockistLimitForm.value.amount,
          rechargeDoneByUid: this.user.userId
        };
        this.masterStockistService.saveStockistBalance(masterData).subscribe(response => {
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Recharge done',
              showConfirmButton: false,
              timer: 1000
            });
            const responseData = response.data;
            const targetStockistIndex = this.stockists.findIndex(x => x.userId === responseData.userId);
            this.stockists[targetStockistIndex].superStockistBalance = responseData.superStockistBalance;
            this.stockists[targetStockistIndex].balance = responseData.balance;
            this.sortedStockistList[targetStockistIndex].balance = responseData.balance;
            this.selectedStockistTransferPoint.balance = responseData.balance;
            this.sortedStockistList[targetStockistIndex].superStockistBalance = responseData.superStockistBalance;
            const userBalance = this.user.balance - this.stockistLimitForm.value.amount;
            this.authService.setUserBalanceBy(userBalance) ;
            // console.log(this.user);
            this.highLightedRowIndex = targetStockistIndex;
            this.stockistLimitForm.patchValue({amount: ''});
            setTimeout(() => {
              this.highLightedRowIndex = -1;
            }, 10000);
            // @ts-ignore
            // Swal.fire({
            //   position: 'top-end',
            //   icon: 'success',
            //   title: 'Recharge done',
            //   showConfirmButton: false,
            //   timer: 1000
            // });
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

  adjustPointToStockist(){
    if(parseInt(this.stockistAdjustForm.value.amount) < 0){
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Amount cannot be negative',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if ((this.selectedStockist.balance) < this.stockistAdjustForm.value.amount){
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Insufficient balance',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to recharge?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, recharge It!'
    }).then((result) => {
      if (result.isConfirmed){
        const masterData = {
          beneficiaryUid: this.stockistAdjustForm.value.beneficiaryUid,
          amount: -(this.stockistAdjustForm.value.amount),
          rechargeDoneByUid: this.user.userId
        };
        this.masterStockistService.saveStockistBalance(masterData).subscribe(response => {
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Recharge done',
              showConfirmButton: false,
              timer: 1000
            });
            const responseData = response.data;
            const targetStockistIndex = this.stockists.findIndex(x => x.userId === responseData.userId);
            this.stockists[targetStockistIndex].superStockistBalance = responseData.superStockistBalance;
            this.stockists[targetStockistIndex].balance = responseData.balance;
            this.sortedStockistList[targetStockistIndex].balance = responseData.balance;
            this.selectedStockist.balance = responseData.balance;
            this.sortedStockistList[targetStockistIndex].superStockistBalance = responseData.superStockistBalance;
            const userBalance = this.user.balance + this.stockistAdjustForm.value.amount;
            this.authService.setUserBalanceBy(userBalance) ;
            // console.log(this.user);
            this.highLightedRowIndex = targetStockistIndex;
            this.stockistAdjustForm.patchValue({amount: ''});
            setTimeout(() => {
              this.highLightedRowIndex = -1;
            }, 10000);
            // this.stockistAdjustForm.reset();
            // this.selectedStockist = null;
            // @ts-ignore
            // Swal.fire({
            //   position: 'top-end',
            //   icon: 'success',
            //   title: 'Recharge done',
            //   showConfirmButton: false,
            //   timer: 1000
            // });
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

  getBackgroundColor(index: number) {
    // tslint:disable-next-line:triple-equals
    if (index == this.highLightedRowIndex){
      return {
        'background-color': 'rgb(103 245 166 / 60%)',
        // color: 'seashell',
        animation: 'blinking 1s infinite'
      };
    }
  }

  updateStockist(){

    const sst = this.superStockists.findIndex(x => x.userId === this.stockistMasterForm.value.superStockistId);
    if (parseFloat(String(this.superStockists[sst].commission)) < parseFloat(this.stockistMasterForm.value.commission)){
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Stockist commission is more than Super Stockist commission',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to update stockist?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update It!'
    }).then((result) => {
      if (result.isConfirmed){
        // tslint:disable-next-line:max-line-length
        const masterData = {stockistId: this.stockistMasterForm.value.id
          , stockistName : this.stockistMasterForm.value.userName
          , superStockistId: this.user.userId
          , userId: this.user.userId
          , commission: this.stockistMasterForm.value.commission};
        this.masterStockistService.updateStockiist(masterData).subscribe(response => {
          if (response.success === 1){
            const responseData = response.data;
            this.sortedStockistList[this.highLightedRowIndex] = responseData;
            this.stockistMasterForm.reset();
            this.isStockistUpdatAble = false;
            setTimeout(() => {
              this.highLightedRowIndex = -1;
            }, 5000);
            // @ts-ignore
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Stockist updated',
              // showConfirmButton: false,
              timer: 1000
            });

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

  editStockist(stockist){
    this.highLightedRowIndex = this.stockists.findIndex(x => x.userId === stockist.userId);

    const data = {
      id: stockist.userId, userName: stockist.userName, pin: stockist.pin, commission: stockist.commission
    };

    this.stockistMasterForm.patchValue(data);
    this.isStockistUpdatAble = true;
  }

  clearMasterStockistForm() {
    this.stockistMasterForm.reset();
    this.highLightedRowIndex = -1;
    this.isStockistUpdatAble = false;
  }

  createNewStockist() {

    const sst = this.superStockists.findIndex(x => x.userId === this.stockistMasterForm.value.superStockistId);
    if (parseFloat(String(this.superStockists[sst].commission)) < parseFloat(this.stockistMasterForm.value.commission)){
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Stockist commission is more than Super Stockist commission',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to create stockist?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create It!'
    }).then((result) => {
      if (result.isConfirmed){
        const masterData = {userName : this.stockistMasterForm.value.userName
          , pin: this.stockistMasterForm.value.pin
          , superStockistId: this.user.userId
          , createdBy: this.user.userId
          , commission: this.stockistMasterForm.value.commission};
        this.masterStockistService.saveNewStockist(masterData).subscribe(response => {
          if (response.success === 1){
            const responseData = response.data;
            // this.stockists.unshift(responseData);
            this.sortedStockistList.unshift(responseData);
            this.stockistMasterForm.reset();
            // @ts-ignore
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Stockist Created',
              showConfirmButton: false,
              timer: 1000
            });
            this.highLightedRowIndex = 0;
            setTimeout(() => {
              this.highLightedRowIndex = -1;
            }, 5000);
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

  onStockistSelection(event: any){
    // this.stockistLimitForm.patchValue({beneficiaryUid: event});
    this.selectedStockistTransferPoint = this.stockists.find(x => x.userId === event);
    this.stockistLimitForm.patchValue({beneficiaryUid: event});
    // this.stockistLimitForm.controls.amount.setValidators([Validators.max(this.selectedStockist.balance)]);

    // if (!event.value){
    //   this.stockistLimitForm.patchValue({beneficiaryUid: event});
    //   this.selectedStockist = this.stockists.find(x => x.userId === event);
    //   this.stockistLimitForm.controls.amount.setValidators([Validators.max(this.selectedStockist.balance)]);
    // }else{
    //   this.stockistAdjustForm.patchValue({beneficiaryUid: 4});
    //   // this.stockistAdjustForm.value.beneficiaryUid = event;
    //   this.selectedStockist = this.stockists.find(x => x.userId === event.value);
    //   this.stockistAdjustForm.controls.amount.setValidators([Validators.max(this.selectedStockist.balance)]);
    // }
  }

  onStockistSelectionAdjustPoint(event: any){
    // this.stockistAdjustForm.patchValue({beneficiaryUid: event});
  
    this.selectedStockist = this.stockists.find(x => x.userId === event);
    this.stockistAdjustForm.patchValue({beneficiaryUid: event});
    // this.stockistAdjustForm.controls.amount.setValidators([Validators.max(this.selectedStockist.balance)]);

    // if (!event.value){
    //   this.stockistLimitForm.patchValue({beneficiaryUid: event});
    //   this.selectedStockist = this.stockists.find(x => x.userId === event);
    //   this.stockistLimitForm.controls.amount.setValidators([Validators.max(this.selectedStockist.balance)]);
    // }else{
    //   this.stockistAdjustForm.patchValue({beneficiaryUid: 4});
    //   // this.stockistAdjustForm.value.beneficiaryUid = event;
    //   this.selectedStockist = this.stockists.find(x => x.userId === event.value);
    //   this.stockistAdjustForm.controls.amount.setValidators([Validators.max(this.selectedStockist.balance)]);
    // }
  }

  // sortData(sort: Sort) {
  //   const data = this.stockists.slice();
  //   if (!sort.active || sort.direction === '') {
  //     this.sortedStockistList = data;
  //     return;
  //   }
  //   this.sortedStockistList = data.sort((a, b) => {
  //     const isAsc = sort.direction === 'asc';
  //     const isDesc = sort.direction === 'desc';
  //     switch (sort.active) {
  //       case 'userName': return compare(a.userName, b.userName, isAsc);
  //       case 'pin': return compare(a.pin, b.pin, isAsc);
  //       case 'balance': return compare(a.balance, b.balance, isAsc);
  //       default: return 0;
  //     }
  //   });
  // }

}
