import { Component, OnInit } from '@angular/core';
import {MasterSuperStockistService} from '../../../services/master-super-stockist.service';
import {SuperStockist} from '../../../models/SuperStockist.model';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {User} from '../../../models/user.model';
import {AuthService} from '../../../services/auth.service';
import {StockistMaster} from '../../../models/StockistMaster.model';
import Swal from 'sweetalert2';
import {MasterTerminalService} from '../../../services/master-terminal.service';
import {Terminal} from '../../../models/Terminal.model';
import {PayoutSlab} from '../../../models/PayoutSlab.model';
import {CommonService} from '../../../services/common.service';
import {TransactionReport} from '../../../models/TransactionReport.model';
import {TransactionReportService} from '../../../services/transaction-report.service';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-master-terminal',
  templateUrl: './master-terminal.component.html',
  styleUrls: ['./master-terminal.component.scss']
})
export class MasterTerminalComponent implements OnInit {

  superStockists: SuperStockist[];
  terminalMasterForm: UntypedFormGroup;
  terminalLimitForm: UntypedFormGroup;
  user: User;
  isTerminalUpdatAble = false;
  stockists: StockistMaster[];
  terminals: Terminal[];
  payoutSlabs: PayoutSlab[] = [];
  sortedTerminalList: Terminal[];
  selectedTerminal: Terminal = null;
  selectedTerminalTransferPoint: Terminal = null;
  public highLightedRowIndex = -1;
  pinCheckValidator = false;
  rechargedToID = null;
  transactionData: TransactionReport[] = [];
  terminalFilter = null;
  p = 1;
  p1 = 1;
  itemsOnEveryPage = 10;
  searchItem = null;

  transactionId = null;
  emailFormControl: any;
  mailStatus: number;
  transactionDetails: any;
  selectedTab = 0;

  game1 = 0;
  game2 = 0;
  game3 = 0;
  game4 = 0;
  game5 = 0;



  constructor(private masterSuperStockistService: MasterSuperStockistService, private authService: AuthService, private masterTerminalService: MasterTerminalService, private commonService: CommonService
              , private transactionReportService: TransactionReportService
  ) {

    this.game1 = 0;
    this.game2 = 0;
    this.game3 = 0;
    this.game4 = 0;
    this.game5 = 0;


    this.mailStatus = 0;

    this.emailFormControl = new UntypedFormControl(null, [Validators.email]);

    this.user = this.authService.userBehaviorSubject.value;
    this.authService.userBehaviorSubject.subscribe((response) => {
      this.user = response;
    });
    this.terminalMasterForm = new UntypedFormGroup({
      id: new UntypedFormControl(null),
      terminalName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      stockistId: new UntypedFormControl(null, [Validators.required]),
      payoutSlabId: new UntypedFormControl(null),
      superStockistId: new UntypedFormControl(null, [Validators.required]),
      pin: new UntypedFormControl(null, [Validators.required]),
      commission: new UntypedFormControl(null, [Validators.required, Validators.max(this.user.commission)]),
    });

    this.terminalLimitForm = new UntypedFormGroup({
      beneficiaryUid: new UntypedFormControl(null, [Validators.required]),
      amount: new UntypedFormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.superStockists = this.masterSuperStockistService.getSuperStockists();
    this.masterSuperStockistService.getSuperStockistListener().subscribe((response) => {
      this.superStockists = response;
    });
    this.terminals = this.masterTerminalService.getTerminals();
    this.masterTerminalService.getTerminalListener().subscribe((response: Terminal[]) => {
      this.terminals = response;
      this.sortedTerminalList =  this.terminals.filter(x => x.superStockistId === this.user.userId);
    });
    this.sortedTerminalList =  this.terminals.filter(x => x.superStockistId === this.user.userId);

    this.masterSuperStockistService.getStockistBySuperStockistId(this.user.userId);
    this.masterSuperStockistService.getStockistListener().subscribe((response) => {
      this.stockists = response;
    });

    this.payoutSlabs = this.masterTerminalService.getPayoutSlabs();
    this.masterTerminalService.getPayoutSlabListener().subscribe((response) => {
      this.payoutSlabs = response;
    });

  }
  updateAutoClaim(value){
    this.masterTerminalService.updateAutoClaim(value).subscribe();
  }

  refreshTerminalList(){
    this.masterTerminalService.getAllUpdatedTerminals();
  }

  gamePermissionUpdate(gameId, terminalId){
    this.masterTerminalService.gamePermission(gameId, terminalId).subscribe();
  }

  updateBlock(value){
    this.masterTerminalService.updateBlock(value).subscribe();
  }

  approveLogin(terminal){
    this.masterTerminalService.loginApprove(terminal.terminalId).subscribe();
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

  sortData(sort: Sort) {
    const data = this.terminals.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedTerminalList = data;
      return;
    }
    this.sortedTerminalList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      const isDesc = sort.direction === 'desc';
      switch (sort.active) {
        case 'terminalName': return compare(a.terminalName, b.terminalName, isAsc);
        case 'stockistName': return compare(a.stockist.userName, b.stockist.userName, isAsc);
        case 'balance': return compare(a.balance, b.balance, isAsc);
        default: return 0;
      }
    });
  }

  checkPinValidation(){
    this.commonService.checkPinValidation(this.terminalMasterForm.value.terminalName).subscribe((response) => {
      // @ts-ignore
      if (response.success === 0){
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'User already exists',
          showConfirmButton: false,
          timer: 2000
        });
        this.pinCheckValidator = true;
        this.terminalMasterForm.patchValue({terminalName: null});
      }else{
        this.pinCheckValidator = false;
      }
    });
  }

  onTerminalSelectTransferPoint(event: any){
    // console.log("test");
    if (!event.value){
      this.terminalLimitForm.patchValue({beneficiaryUid: event});
      this.selectedTerminalTransferPoint = this.terminals.find(x => x.terminalId === event);
      // this.terminalLimitForm.controls.amount.setValidators([Validators.max(this.selectedTerminalTransferPoint.stockist.balance)]);
    }else{
      this.selectedTerminalTransferPoint = this.terminals.find(x => x.terminalId === event.value);
      this.terminalLimitForm.controls.amount.setValidators([Validators.max(this.selectedTerminalTransferPoint.stockist.balance)]);      
    }
  }

  onTerminalSelect(event: any){
    // console.log("test");
    if (!event.value){
      this.terminalLimitForm.patchValue({beneficiaryUid: event});
      this.selectedTerminal = this.terminals.find(x => x.terminalId === event);
      // this.terminalLimitForm.controls.amount.setValidators([Validators.max(this.selectedTerminal.stockist.balance)]);
    }else{
      this.selectedTerminal = this.terminals.find(x => x.terminalId === event.value);
      this.terminalLimitForm.controls.amount.setValidators([Validators.max(this.selectedTerminal.stockist.balance)]);
    }
  }

  selectSuperStockist(stockist){
    this.terminalMasterForm.patchValue({superStockistId: stockist.super_stockist_id});
    this.terminalMasterForm.value.superStockistId = stockist.superStockistId;
  }

  rechargeToTerminal() {

    if (parseInt(this.terminalLimitForm.value.amount) < 0){
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Amount cannot be negative',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if ((this.selectedTerminalTransferPoint.stockist.balance) < this.terminalLimitForm.value.amount){
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
          beneficiaryUid: this.terminalLimitForm.value.beneficiaryUid,
          stockistId: this.selectedTerminalTransferPoint.stockist.userId,
          amount: this.terminalLimitForm.value.amount,
          rechargeDoneByUid: this.user.userId
        };
        this.masterTerminalService.saveTerminalBalance(masterData).subscribe(response => {
          if (response.success === 1){
            const responseData = response.data;
            const targetTerminalIndex = this.terminals.findIndex(x => x.terminalId === responseData.terminalId);
            this.terminals[targetTerminalIndex].balance = responseData.balance;
            this.terminals[targetTerminalIndex].stockist.balance = responseData.stockist.balance;
            const userBalance = this.user.balance - this.terminalLimitForm.value.amount;
            this.authService.setUserBalanceBy(userBalance) ;
            this.sortedTerminalList[targetTerminalIndex].balance = responseData.balance;
            this.sortedTerminalList[targetTerminalIndex].stockist.balance = responseData.stockist.balance;

            this.highLightedRowIndex = targetTerminalIndex;
            // this.terminalLimitForm.controls.amount.setValidators([Validators.max(responseData.stockist.balance)]);
            this.terminalLimitForm.patchValue({amount: ''});
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

  adjustPointToTerminal() {
    console.log(this.selectedTerminal.balance);
    console.log(this.terminalLimitForm.value.amount);

    if (parseInt(this.terminalLimitForm.value.amount) < 0){
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Amount cannot be negative',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if ((this.selectedTerminal.balance) < parseInt(this.terminalLimitForm.value.amount)){
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
          beneficiaryUid: this.terminalLimitForm.value.beneficiaryUid,
          stockistId: this.selectedTerminal.stockist.userId,
          amount: -(this.terminalLimitForm.value.amount),
          rechargeDoneByUid: this.user.userId
        };
        this.masterTerminalService.saveTerminalBalance(masterData).subscribe(response => {
          if (response.success === 1){
            const responseData = response.data;
            const targetTerminalIndex = this.terminals.findIndex(x => x.terminalId === responseData.terminalId);
            this.terminals[targetTerminalIndex].balance = responseData.balance;
            this.terminals[targetTerminalIndex].stockist.balance = responseData.stockist.balance;
            const userBalance = this.user.balance - this.terminalLimitForm.value.amount;
            this.authService.setUserBalanceBy(userBalance) ;
            this.sortedTerminalList[targetTerminalIndex].balance = responseData.balance;
            this.sortedTerminalList[targetTerminalIndex].stockist.balance = responseData.stockist.balance;

            this.highLightedRowIndex = targetTerminalIndex;
            // this.terminalLimitForm.controls.amount.setValidators([Validators.max(responseData.stockist.balance)]);
            this.terminalLimitForm.patchValue({amount: ''});
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

  updateTerminal(){

    const st = this.stockists.findIndex(x => x.id === this.terminalMasterForm.value.stockistId);
    if (parseFloat(String(this.stockists[st].commission)) < parseFloat(this.terminalMasterForm.value.commission)){
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Terminal commission is more than stockist commission',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to update terminal?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update It!'
    }).then((result) => {
      if (result.isConfirmed){
        // tslint:disable-next-line:max-line-length
        const masterData = {terminalId: this.terminalMasterForm.value.id
          , terminalName : this.terminalMasterForm.value.terminalName
          , stockistId: this.terminalMasterForm.value.stockistId
          , superStockistId: this.user.userId
          , payoutSlabId: this.terminalMasterForm.value.payoutSlabId
          , pin: this.terminalMasterForm.value.pin
          , userId: this.user.userId
          , commission: this.terminalMasterForm.value.commission};
        this.masterTerminalService.updateTerminal(masterData).subscribe(response => {
          if (response.success === 1){
            const responseData = response.data;
            this.sortedTerminalList[this.highLightedRowIndex] = responseData;
            this.terminalMasterForm.reset();
            this.isTerminalUpdatAble = false;
            setTimeout(() => {
              this.highLightedRowIndex = -1;
            }, 5000);
            // @ts-ignore
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Terminal Updated',
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

  enableGameCreateTerminal(game_id){
    if (game_id === 1){
      this.game1 = (this.game1 === 1) ? 0 : 1;
    }else if (game_id === 2){
      this.game2 = (this.game2 === 1) ? 0 : 1;
    }else if (game_id === 3){
      this.game3 = (this.game3 === 1) ? 0 : 1;
    }else if (game_id === 4){
      this.game4 = (this.game4 === 1) ? 0 : 1;
    }else if (game_id === 5){
      this.game5 = (this.game5 === 1) ? 0 : 1;
    }
  }

  editTerminal(terminal){
    // this.highLightedRowIndex = this.terminals.findIndex(x => x.terminalId === terminal.terminalId);
    const data = {
      id: terminal.terminalId
      , terminalName: terminal.terminalName
      , stockistId: terminal.stockistId
      , pin: terminal.pin
      , payoutSlabId: terminal.payoutSlabId
      , commission: terminal.commission
      , superStockistId: terminal.superStockistId
    };
    this.terminalMasterForm.patchValue(data);
    this.isTerminalUpdatAble = true;
  }

  getBackgroundColor(index: number, terminal) {
    // tslint:disable-next-line:triple-equals
    if (index == this.highLightedRowIndex){
      return {
        'background-color': 'rgb(103 245 166 / 60%)',
        // color: 'seashell',
        animation: 'blinking 1s infinite'
      };
    }

    if (terminal.status === 'Offline'){
      return {
        'background-color': '#f08080',
      };
    }else if (terminal.status === 'Online'){
      return {
        'background-color': '#90ee90',
      };
    }
  }

  clearMasterTerminalForm() {
    this.terminalMasterForm.reset();
    // this.highLightedRowIndex = -1;
    this.isTerminalUpdatAble = false;
  }


  createNewTerminal() {

    const st = this.stockists.findIndex(x => x.id === this.terminalMasterForm.value.stockistId);
    if (parseFloat(String(this.stockists[st].commission)) < parseFloat(this.terminalMasterForm.value.commission)){
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Terminal commission is more than stockist commission',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to create terminal?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create It!'
    }).then((result) => {
      if (result.isConfirmed){
        // tslint:disable-next-line:max-line-length
        const masterData = {terminalId: this.terminalMasterForm.value.id
          , terminalName : this.terminalMasterForm.value.terminalName
          , stockistId: this.terminalMasterForm.value.stockistId
          , superStockistId: this.user.userId
          , payoutSlabId: this.terminalMasterForm.value.payoutSlabId
          , createdBy : this.user.userId
          , pin: this.terminalMasterForm.value.pin
          , commission: this.terminalMasterForm.value.commission
          , game1: this.game1
          , game2: this.game2
          , game3: this.game3
          , game4: this.game4
          , game5: this.game5
        };
        // console.log(masterData);
        this.masterTerminalService.saveNewTerminal(masterData).subscribe(response => {
          if (response.success === 1){
            const responseData = response.data;
            this.game1 = 0;
            this.game2 = 0;
            this.game3 = 0;
            this.game4 = 0;
            this.game5 = 0;
            // this.terminals.unshift(responseData);
            this.clearMasterTerminalForm();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Terminal created',
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
          // console.log('data saving error', error);
        });
      }
    });
  }

  getTransactionDetails(){
    this.masterTerminalService.getTransactionDetails(this.selectedTerminal.terminalId).subscribe((response ) => {
      // @ts-ignore
      this.transactionDetails = response.data;
    });
  }

  sendMailTransaction(){

    if (this.transactionId == null){
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Select terminal',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    const x = {
      email: this.emailFormControl.value,
      sentBy: this.user.userId,
      terminalId: this.transactionId
    };
    this.mailStatus = 1;
    this.masterTerminalService.sendMailTransaction(x).subscribe((response) => {
      // @ts-ignore
      if (response.success === 1){
        this.mailStatus = 0;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Mail Sent',
          showConfirmButton: false,
          timer: 1000
        });
        // this.emailFormControl.value = null;
        this.emailFormControl.reset();
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
