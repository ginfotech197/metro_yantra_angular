import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import Swal from 'sweetalert2';
import {MasterStockistService} from '../../../services/master-stockist.service';
import {Stockist} from '../../../models/Stockist.model';
import {Sort} from '@angular/material/sort';
import {User} from '../../../models/user.model';
import {AuthService} from '../../../services/auth.service';
import {MasterSuperStockistService} from '../../../services/master-super-stockist.service';
import {SuperStockist} from '../../../models/SuperStockist.model';
import {ServerResponse} from "../../../models/ServerResponse.model";
import {CommonService} from "../../../services/common.service";
import {TransactionReportService} from '../../../services/transaction-report.service';
import {TransactionReport} from '../../../models/TransactionReport.model';

@Component({
  selector: 'app-master-stockist',
  templateUrl: './master-stockist.component.html',
  styleUrls: ['./master-stockist.component.scss']
})
export class MasterStockistComponent implements OnInit {

  isProduction = environment.production;
  showDevArea = false;
  isStockistUpdateAble = false;
  stockistMasterForm: UntypedFormGroup;
  stockistLimitForm: UntypedFormGroup;
  user: User;
  stockists: Stockist[] = [];
  superStockists: SuperStockist[] = [];
  sortedStockistList: Stockist[] = [];
  selectedStockistTransferPoint: Stockist = null;
  selectedStockist: Stockist = null;
  public highLightedRowIndex = -1;
  pinCheckValidator = false;
  rechargedToID = null;
  transactionData: TransactionReport[] = [];
  p: number = 1;
  p1: number = 1;
  itemsOnEveryPage = 20;
  selectedTab = 0;
  searchItem = null;

  screenWidth: any;  
  screenHeight: any; 



  constructor(private masterStockistService: MasterStockistService, private authService: AuthService, private masterSuperStockistService: MasterSuperStockistService, private commonService: CommonService
              , private transactionReportService: TransactionReportService
  ) {

    this.screenWidth = window.innerWidth;  
    this.screenHeight = window.innerHeight;


    this.user = this.authService.userBehaviorSubject.value;
    this.authService.userBehaviorSubject.subscribe((response) => {
      this.user = response;
    });
    this.stockistMasterForm = new UntypedFormGroup({
      id: new UntypedFormControl(null),
      userName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      superStockistId: new UntypedFormControl(null, [Validators.required]),
      pin: new UntypedFormControl(null, [Validators.required]),
      commission: new UntypedFormControl(null, [Validators.required, Validators.max(100)]),
    });
    this.stockistLimitForm = new UntypedFormGroup({
      beneficiaryUid: new UntypedFormControl(null, [Validators.required]),
      amount: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
    });
  }

  ngOnInit(): void {
    this.stockists = this.masterStockistService.getStockists();
    this.sortedStockistList = this.masterStockistService.getStockists();
    this.masterStockistService.getStockistListener().subscribe((response: Stockist[]) => {
      this.stockists = response;
      this.sortedStockistList = response;
    });

    this.superStockists = this.masterSuperStockistService.getSuperStockists();
    this.masterSuperStockistService.getSuperStockistListener().subscribe((response) => {
      this.superStockists = response;
    });

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
  }

  onStockistSelectTransferPoint(event: any){
    this.selectedStockistTransferPoint = this.stockists.find(x => x.userId === event.value);
  }

  editStockist(stockist){
    this.highLightedRowIndex = this.stockists.findIndex(x => x.userId === stockist.userId);
    // console.log(targetStockistIndex);
    const data = {
      id: stockist.userId, userName: stockist.userName, pin: stockist.pin, superStockistId: stockist.superStockistId, commission: stockist.commission
     };
    this.stockistMasterForm.patchValue(data);
    this.isStockistUpdateAble = true;
  }

  passwordChecker(password){
    if(password == "1001"){
      return true;
    }else{
      return false;
    }
  }

  deleteStockist(id){
    Swal.fire({
      title: 'Enter Password To Delete',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        if(this.passwordChecker(result.value)){
          this.masterStockistService.deleteStokistByAdmin(id).subscribe((response) => {
            // console.log(response);
          });
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Wrong Password',
            showConfirmButton: false,
            timer: 3000
          });
        }
      }
    });  
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
        const masterData = {id: this.stockistMasterForm.value.id
          , userName : this.stockistMasterForm.value.userName
          , superStockistId : this.stockistMasterForm.value.superStockistId
          , commission: this.stockistMasterForm.value.commission};
        // console.log(masterData);
        this.masterStockistService.updateStockiist(masterData).subscribe(response => {
          if (response.success === 1){
            const responseData = response.data;
            this.sortedStockistList[this.highLightedRowIndex] = responseData;
            this.stockistMasterForm.reset();
            this.isStockistUpdateAble = false;
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
          , superStockistId: this.stockistMasterForm.value.superStockistId
          // , superStockistId: 3
          , createdBy: this.user.userId
          , commission: this.stockistMasterForm.value.commission};
        this.masterStockistService.saveNewStockist(masterData).subscribe(response => {
          if (response.success === 1){
            const responseData = response.data;
            // this.stockists.unshift(responseData);
            // this.sortedStockistList.unshift(responseData);
            this.highLightedRowIndex = 0;
            this.stockistLimitForm.reset();
            this.stockistMasterForm.reset();
            // this.clearMasterStockistForm();
            setTimeout(() => {
              this.highLightedRowIndex = -1;
            }, 10000);
            // @ts-ignore
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Stockist Created',
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

  clearMasterStockistForm() {
    this.stockistMasterForm.reset();
    this.highLightedRowIndex = -1;
    this.isStockistUpdateAble = false;

  }

  sortData(sort: Sort) {
    const data = this.stockists.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedStockistList = data;
      return;
    }
    this.sortedStockistList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      const isDesc = sort.direction === 'desc';
      switch (sort.active) {
        case 'userName': return compare(a.userName, b.userName, isAsc);
        case 'pin': return compare(a.pin, b.pin, isAsc);
        case 'balance': return compare(a.balance, b.balance, isAsc);
        default: return 0;
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

    // tslint:disable-next-line:radix
      if (parseInt(this.stockistLimitForm.value.amount) > parseInt(String(this.selectedStockistTransferPoint.superStockistBalance))){
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: 'Low Balance',
          showConfirmButton: false,
          timer: 3000
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
            rechargeDoneByUid: this.user.userId,
            superStockiestID: this.selectedStockistTransferPoint.superStockistId
          };
          this.masterStockistService.saveStockistBalance(masterData).subscribe(response => {
            if (response.success === 1){
              const responseData = response.data;
              const targetStockistIndex = this.stockists.findIndex(x => x.userId === responseData.userId);
              this.stockists[targetStockistIndex].balance = responseData.balance;
              // this.sortedStockistList[targetStockistIndex].balance = responseData.balance;
              // console.log(this.sortedStockistList[targetStockistIndex]);
              this.selectedStockistTransferPoint.superStockistBalance = responseData.superStockistBalance;
              this.selectedStockistTransferPoint.balance = responseData.balance;
              const userBalance = this.user.balance - this.stockistLimitForm.value.amount;
              this.authService.setUserBalanceBy(userBalance) ;
              this.highLightedRowIndex = targetStockistIndex;
              this.stockistLimitForm.patchValue({amount: ''});
              setTimeout(() => {
                this.highLightedRowIndex = -1;
              }, 10000);
              // @ts-ignore
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Recharge done',
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


  adjustPointToStockist() {

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

    // tslint:disable-next-line:radix
      if (parseInt(String(this.selectedStockist.balance)) < parseInt(String(this.stockistLimitForm.value.amount))){
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: 'Low Balance',
          showConfirmButton: false,
          timer: 3000
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
            amount: -(this.stockistLimitForm.value.amount),
            rechargeDoneByUid: this.user.userId,
            superStockiestID: this.selectedStockist.superStockistId
          };
          this.masterStockistService.saveStockistBalance(masterData).subscribe(response => {
            if (response.success === 1){
              const responseData = response.data;
              const targetStockistIndex = this.stockists.findIndex(x => x.userId === responseData.userId);
              this.stockists[targetStockistIndex].balance = responseData.balance;
              // this.sortedStockistList[targetStockistIndex].balance = responseData.balance;
              // console.log(this.sortedStockistList[targetStockistIndex]);
              this.selectedStockist.superStockistBalance = responseData.superStockistBalance;
              this.selectedStockist.balance = responseData.balance;
              const userBalance = this.user.balance - this.stockistLimitForm.value.amount;
              this.authService.setUserBalanceBy(userBalance) ;
              this.highLightedRowIndex = targetStockistIndex;
              this.stockistLimitForm.patchValue({amount: ''});
              setTimeout(() => {
                this.highLightedRowIndex = -1;
              }, 10000);
              // @ts-ignore
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Recharge done',
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

  onStockistSelectionTransferPoint(event: any){
    if (!event.value){
      this.stockistLimitForm.patchValue({beneficiaryUid: event});
      this.selectedStockistTransferPoint = this.stockists.find(x => x.userId === event);
      this.stockistLimitForm.controls.amount.setValidators([Validators.max(this.selectedStockistTransferPoint.balance)]);
    }else{
      this.selectedStockistTransferPoint = this.stockists.find(x => x.userId === event.value);
      this.stockistLimitForm.controls.amount.setValidators([Validators.max(this.selectedStockistTransferPoint.balance)]);
    }
  }


  onStockistSelection(event: any){
    // console.log((event))
    if (!event.value){
      this.stockistLimitForm.patchValue({beneficiaryUid: event});
      this.selectedStockist = this.stockists.find(x => x.userId === event);
      this.stockistLimitForm.controls.amount.setValidators([Validators.max(this.selectedStockist.balance)]);
    }else{
      this.selectedStockist = this.stockists.find(x => x.userId === event.value);
      this.stockistLimitForm.controls.amount.setValidators([Validators.max(this.selectedStockist.balance)]);
    }
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
