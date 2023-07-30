import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { MasterStockistService } from '../../../services/master-stockist.service';
import { MasterSuperStockistService } from '../../../services/master-super-stockist.service';
import Swal from 'sweetalert2';
import { SuperStockist } from '../../../models/SuperStockist.model';
import { CommonService } from '../../../services/common.service';
import { TransactionReportService } from '../../../services/transaction-report.service';
import { TransactionReport } from '../../../models/TransactionReport.model';

@Component({
  selector: 'app-master-super-stockist',
  templateUrl: './master-super-stockist.component.html',
  styleUrls: ['./master-super-stockist.component.scss']
})
export class MasterSuperStockistComponent implements OnInit {

  superStockistMasterForm: UntypedFormGroup;
  superStockistLimitForm: UntypedFormGroup;
  superStockistTansactionForm: UntypedFormGroup;
  superStockistAdjustForm: UntypedFormGroup;
  isSuperStockistUpdateAble = false;
  user: User;
  superStockists: SuperStockist[] = [];
  public highLightedRowIndex = -1;
  selectedSuperStockist: SuperStockist = null;
  selectedSuperStockistTransferPoint: SuperStockist =null;
  pinCheckValidator = false;
  rechargedToID = null;
  p: number = 1;
  p1: number = 1;

  itemsOnEveryPage = 20;
  
  selectedTab = 0;
  searchItem = null;

  deviceXs: boolean;

  screenWidth: any;  
  screenHeight: any; 

  transactionData: TransactionReport[] = [];

  constructor(private authService: AuthService, private masterSuperStockistService: MasterSuperStockistService, private commonService: CommonService
    , private transactionReportService: TransactionReportService
  ) {

    this.screenWidth = window.innerWidth;  
    this.screenHeight = window.innerHeight;  

    // console.log(this.screenHeight);
    // console.log(this.screenWidth);

    this.deviceXs = this.commonService.deviceXs;
    // console.log("For teting", this.deviceXs);
    this.superStockists = this.masterSuperStockistService.getSuperStockists();
    this.masterSuperStockistService.getSuperStockistListener().subscribe((response) => {
      this.superStockists = response;
    });
    this.user = this.authService.userBehaviorSubject.value;
    this.authService.userBehaviorSubject.subscribe((response) => {
      this.user = response;
    });

  }

  ngOnInit(): void {

    this.superStockistMasterForm = new UntypedFormGroup({
      id: new UntypedFormControl(null),
      userName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      pin: new UntypedFormControl(null, [Validators.required]),
      commission: new UntypedFormControl(null, [Validators.required]),
    });

    this.superStockistLimitForm = new UntypedFormGroup({
      beneficiaryUid: new UntypedFormControl(null, [Validators.required]),
      amount: new UntypedFormControl(null, [Validators.required, Validators.minLength(1)]),
    });

    this.superStockistAdjustForm = new UntypedFormGroup({
      beneficiaryUid: new UntypedFormControl(null, [Validators.required]),
      amount: new UntypedFormControl(null, [Validators.required, Validators.minLength(1)]),
    });

    // this.superStockistTansactionForm = new FormGroup({
    //   rechargedByID: new FormControl(null, [Validators.required]),
    //   rechargedToID: new FormControl(null, [Validators.required]),
    // });


  }

  passwordChecker(password){
    if(password == "1001"){
      return true;
    }else{
      return false;
    }
  }

  deleteSuperStokist(id){

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
          this.masterSuperStockistService.deleteSuperStokistByAdmin(id).subscribe((response) => {
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

  updateBlock(value) {
    this.masterSuperStockistService.updateBlock(value).subscribe();
  }

  refreshSuperStockistList() {
    this.masterSuperStockistService.getAllUpdatedSuperStockist();
  }

  getBackgroundColor(index: number) {
    // tslint:disable-next-line:triple-equals
    if (index == this.highLightedRowIndex) {
      return {
        'background-color': 'rgb(103 245 166 / 60%)',
        // color: 'seashell',
        animation: 'blinking 1s infinite'
      };
    }
  }

  onSuperStockistSelectTransferPoint(event: any) {
    this.selectedSuperStockistTransferPoint = this.superStockists.find(x => x.userId === event.value);
  }

  onSuperStockistSelect(event: any) {
    this.selectedSuperStockist = this.superStockists.find(x => x.userId === event.value);
  }

  checkPinValidation() {
    this.commonService.checkPinValidation(this.superStockistMasterForm.value.pin).subscribe((response) => {
      // @ts-ignore
      if (response.success === 0) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Pin already exists',
          showConfirmButton: false,
          timer: 2000
        });
        this.pinCheckValidator = true;
      } else {
        this.pinCheckValidator = false;
      }
    });
  }

  createNewSuperStockist() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to create stockist?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create It!'
    }).then((result) => {
      if (result.isConfirmed) {
        const masterData = {
          userName: this.superStockistMasterForm.value.userName
          , pin: this.superStockistMasterForm.value.pin
          , createdBy: this.user.userId
          , commission: this.superStockistMasterForm.value.commission
        };

        this.masterSuperStockistService.saveSuperStockist(masterData).subscribe((response) => {
          if (response.success === 1) {
            this.superStockistMasterForm.reset();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Super Stockist created',
              // showConfirmButton: false,
              timer: 1000
            });
            this.superStockistMasterForm.reset();
          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Validation error',
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      }
    });
  }

  getTransaction() {
    const transactionDetail = {
      rechargedToID: this.rechargedToID,
      rechargedByID: this.user.userId
    };

    this.transactionReportService.getTransactionByUser(transactionDetail).subscribe((response) => {
      this.transactionData = response.data;
    });
  }

  rechargeToSuperStockist() {

    if (parseInt(this.superStockistLimitForm.value.amount) < 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Amount cannot be negative',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    // if (parseInt(this.superStockistLimitForm.value.amount) > parseInt(String(this.user.balance))){
    //   Swal.fire({
    //     position: 'top-end',
    //     icon: 'info',
    //     title: 'Low Balance',
    //     showConfirmButton: false,
    //     timer: 3000
    //   });
    //   return;
    // }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to recharge?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, recharge It!'
    }).then((result) => {
      if (result.isConfirmed) {
        const masterData = {
          beneficiaryUid: this.superStockistLimitForm.value.beneficiaryUid,
          amount: this.superStockistLimitForm.value.amount,
          rechargeDoneByUid: this.user.userId
        };
        this.masterSuperStockistService.saveSuperStockistBalance(masterData).subscribe(response => {
          if (response.success === 1) {

            // @ts-ignore
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Recharge done',
              showConfirmButton: false,
              timer: 1000
            });

            const responseData = response.data;
            const targetStockistIndex = this.superStockists.findIndex(x => x.userId === responseData.userId);
            this.superStockists[targetStockistIndex].balance = responseData.balance;
            const userBalance = this.user.balance - this.superStockistLimitForm.value.amount;
            this.authService.setUserBalanceBy(userBalance);
            // this.selectedSuperStockist[targetStockistIndex].balance = responseData.balance;
            this.selectedSuperStockistTransferPoint.balance = responseData.balance;
            // this.superStockistLimitForm.reset();
            this.superStockistLimitForm.patchValue({ amount: '' });
            // this.highLightedRowIndex = targetStockistIndex;
            // this.stockistLimitForm.patchValue({amount: ''});
            setTimeout(() => {
              this.highLightedRowIndex = -1;
            }, 10000);

            // updating terminal balance from here

          } else {
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
    // }else{
    //   Swal.fire({
    //       title: 'Confirmation',
    //       text: 'input balance is greater than user balance',
    //       icon: 'info',
    //       showCancelButton: true,
    //       confirmButtonColor: '#3085d6',
    //       cancelButtonColor: '#d33',
    //       confirmButtonText: 'try again !'
    //     });
    // }
    // Swal.fire({
    //   title: 'Confirmation',
    //   text: 'Do you sure to recharge?',
    //   icon: 'info',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, recharge It!'
    // }).then((result) => {
    //   if (result.isConfirmed){
    //     const masterData = {
    //       beneficiaryUid: this.superStockistLimitForm.value.beneficiaryUid,
    //       amount: this.superStockistLimitForm.value.amount,
    //       rechargeDoneByUid: this.user.userId
    //     };
    //     this.masterSuperStockistService.saveSuperStockistBalance(masterData).subscribe(response => {
    //       if (response.success === 1){
    //         const responseData = response.data;
    //         const targetStockistIndex = this.superStockists.findIndex(x => x.userId === responseData.userId);
    //         this.superStockists[targetStockistIndex].balance = responseData.balance;
    //         const userBalance = this.user.balance - this.superStockistLimitForm.value.amount;
    //         this.authService.setUserBalanceBy(userBalance) ;
    //         // this.sortedStockistList[targetStockistIndex].balance = responseData.balance;
    //         // this.highLightedRowIndex = targetStockistIndex;
    //         // this.stockistLimitForm.patchValue({amount: ''});
    //         setTimeout(() => {
    //           this.highLightedRowIndex = -1;
    //         }, 10000);
    //         // @ts-ignore
    //         Swal.fire({
    //           position: 'top-end',
    //           icon: 'success',
    //           title: 'Recharge done',
    //           showConfirmButton: false,
    //           timer: 1000
    //         });
    //         // updating terminal balance from here
    //
    //       }else{
    //         Swal.fire({
    //           position: 'top-end',
    //           icon: 'error',
    //           title: 'Validation error',
    //           showConfirmButton: false,
    //           timer: 3000
    //         });
    //       }
    //     }, (error) => {
    //       // when error occured
    //       console.log('data saving error', error);
    //     });
    //   }
    // });
  }

  adjustPointToSuperStockist() {
    if (parseInt(this.superStockistAdjustForm.value.amount) < 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Amount cannot be negative',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (parseInt(this.superStockistAdjustForm.value.amount) > parseInt(String(this.selectedSuperStockist.balance))) {
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Insufficient Balance',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to adjust?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, adjust It!'
    }).then((result) => {
      if (result.isConfirmed) {
        const masterData = {
          beneficiaryUid: this.superStockistAdjustForm.value.beneficiaryUid,
          amount: -(this.superStockistAdjustForm.value.amount),
          rechargeDoneByUid: this.user.userId
        };
        this.masterSuperStockistService.saveSuperStockistBalance(masterData).subscribe(response => {
          if (response.success === 1) {

            // @ts-ignore
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Adjust done',
              showConfirmButton: false,
              timer: 1000
            });

            const responseData = response.data;
            const targetStockistIndex = this.superStockists.findIndex(x => x.userId === responseData.userId);
            this.superStockists[targetStockistIndex].balance = responseData.balance;
            const userBalance = this.user.balance - this.superStockistAdjustForm.value.amount;
            this.authService.setUserBalanceBy(userBalance);
            // this.selectedSuperStockist[targetStockistIndex].balance = responseData.balance;
            this.selectedSuperStockist.balance = responseData.balance;
            // this.superStockistAdjustForm.reset();
            this.superStockistAdjustForm.patchValue({ amount: '' });
            // this.highLightedRowIndex = targetStockistIndex;
            // this.stockistLimitForm.patchValue({amount: ''});
            setTimeout(() => {
              this.highLightedRowIndex = -1;
            }, 10000);

            // updating terminal balance from here

          } else {
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

  clearMasterSuperStockistForm() {
    this.superStockistMasterForm.reset();
    this.highLightedRowIndex = -1;
    this.isSuperStockistUpdateAble = false;
  }

  editStockist(superStockist) {
    const data = {
      id: superStockist.userId, userName: superStockist.userName, pin: superStockist.password, commission: superStockist.commission
    };
    this.superStockistMasterForm.patchValue(data);
    this.isSuperStockistUpdateAble = true;
  }

  updateSuperStockist() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you want update super stockist?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create It!'
    }).then((result) => {
      if (result.isConfirmed) {
        // const masterData = {userName : this.superStockistMasterForm.value.userName
        //   , pin: this.superStockistMasterForm.value.pin
        //   , createdBy: this.user.userId
        //   , commission: this.superStockistMasterForm.value.commission};

        this.masterSuperStockistService.updateSuperStockist(this.superStockistMasterForm.value).subscribe((response) => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Super Stockist created',
              // showConfirmButton: false,
              timer: 1000
            });
            this.superStockistMasterForm.reset();
          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Validation error',
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      }
    });
  }

  onTerminalSelectTransferPoint(event: any){
    // console.log((event))
    // if (!event.value){
      this.superStockistLimitForm.patchValue({beneficiaryUid: event});
      this.selectedSuperStockistTransferPoint = this.superStockists.find(x => x.userId === event);
      // this.superStockistLimitForm.controls.amount.setValidators([Validators.max(this.selectedSuperStockist.balance)]);
    // }else{
    //   this.selectedSuperStockist = this.superStockists.find(x => x.userId === event.value);
    //   this.superStockistLimitForm.controls.amount.setValidators([Validators.max(this.selectedSuperStockist.balance)]);
    // }
  }

  onTerminalSelect(event: any){
    // console.log((event))
    // if (!event.value){
      this.superStockistAdjustForm.patchValue({beneficiaryUid: event});
      this.selectedSuperStockist = this.superStockists.find(x => x.userId === event);
      // this.superStockistAdjustForm.controls.amount.setValidators([Validators.max(this.selectedSuperStockist.balance)]);
    // }else{
    //   this.selectedSuperStockist = this.superStockists.find(x => x.userId === event.value);
    //   this.superStockistAdjustForm.controls.amount.setValidators([Validators.max(this.selectedSuperStockist.balance)]);
    // }
  }


}
