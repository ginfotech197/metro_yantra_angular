import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Terminal} from '../../../models/Terminal.model';
import {MasterTerminalService} from '../../../services/master-terminal.service';
import {Stockist} from '../../../models/Stockist.model';
import {MasterStockistService} from '../../../services/master-stockist.service';
import Swal from 'sweetalert2';
import {Sort} from '@angular/material/sort';
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../models/user.model';
import {MasterSuperStockistService} from '../../../services/master-super-stockist.service';
import {SuperStockist} from '../../../models/SuperStockist.model';
import {PayoutSlab} from '../../../models/PayoutSlab.model';
import {CommonService} from '../../../services/common.service';
import {element} from 'protractor';
import {TransactionReportService} from '../../../services/transaction-report.service';
import {TransactionReport} from '../../../models/TransactionReport.model';
import { ServerOptions } from 'https';
import { ServerResponse } from 'http';

@Component({
  selector: 'app-master-terminal',
  templateUrl: './master-terminal.component.html',
  styleUrls: ['./master-terminal.component.scss']
})
export class MasterTerminalComponent implements OnInit {
  isProduction = environment.production;
  showDevArea = false;
  isTerminalUpdatAble = false;
  terminalMasterForm: UntypedFormGroup;
  terminalLimitForm: UntypedFormGroup;
  user: User;
  terminals: Terminal[] = [];
  sortedTerminalList: Terminal[] = [];
  stockists: Stockist[] = [];
  payoutSlabs: PayoutSlab[] = [];
  superStockists: SuperStockist[] = [];
  selectedTerminal: Terminal = null;
  selectedTerminalTransferPoint: Terminal = null;
  public highLightedRowIndex = -1;
  pinCheckValidator = false;
  rechargedToID = null;
  searchItem = null;
  transactionId = null;
  terminalFilter = null;
  transactionData: TransactionReport[] = [];
  selectedTab = 0;
  p = 1;
  p1 = 1;
  p2 = 1;
  p3 = 1;
  itemsOnEveryPage = 20;
  transactionDetails: any;
  emailFormControl: any;
  mailStatus: number;

  game1 = 0;
  game2 = 0;
  game3 = 0;
  game4 = 0;
  game5 = 0;
  game6 = 0;
  screenWidth: any;
  screenHeight: any;

  constructor(private masterTerminalService: MasterTerminalService, private masterStockistService: MasterStockistService
              , private transactionReportService: TransactionReportService
              , private authService: AuthService, private masterSuperStockistService: MasterSuperStockistService, private commonService: CommonService) {


    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;


    this.game1 = 0;
    this.game2 = 0;
    this.game3 = 0;
    this.game4 = 0;
    this.game5 = 0;
    this.game6 = 0;

    this.mailStatus = 0;

    this.emailFormControl = new UntypedFormControl(null, [Validators.email]);

    this.terminalMasterForm = new UntypedFormGroup({
      id: new UntypedFormControl(null),
      terminalName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      stockistId: new UntypedFormControl(null, [Validators.required]),
      payoutSlabId: new UntypedFormControl(null),
      superStockistId: new UntypedFormControl(null, [Validators.required]),
      pin: new UntypedFormControl(null, [Validators.required]),
      commission: new UntypedFormControl(null, [Validators.required]),
    });

    this.terminalLimitForm = new UntypedFormGroup({
      beneficiaryUid: new UntypedFormControl(null, [Validators.required]),
      amount: new UntypedFormControl(null, [Validators.required, Validators.max(0)]),
    });

    this.user = this.authService.userBehaviorSubject.value;
    this.authService.userBehaviorSubject.subscribe((response) => {
      this.user = response;
      // console.log(this.user);
    });

  }

  ngOnInit(): void {
    this.user = this.authService.userBehaviorSubject.value;
    this.terminals = this.masterTerminalService.getTerminals();
    this.sortedTerminalList = this.masterTerminalService.getTerminals();
    this.masterTerminalService.getTerminalListener().subscribe((response: Terminal[]) => {
      this.terminals = response;
      this.sortedTerminalList = response;
      this.shortOnline();
    });

    this.superStockists = this.masterSuperStockistService.getSuperStockists();
    this.masterSuperStockistService.getSuperStockistListener().subscribe((response) => {
      this.superStockists = response;
    });

    this.payoutSlabs = this.masterTerminalService.getPayoutSlabs();
    this.masterTerminalService.getPayoutSlabListener().subscribe((response) => {
      this.payoutSlabs = response;
    });

    this.stockists = this.masterStockistService.getStockists();
    this.masterStockistService.getStockistListener().subscribe((response: Stockist[]) => {
      this.stockists = response;
    });

    this.shortOnline();
  }

  updateBlock(value){
    this.masterTerminalService.updateBlock(value).subscribe();
  }

  updateAutoClaim(value){
    this.masterTerminalService.updateAutoClaim(value).subscribe();
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

  getTransaction(){
    const transactionDetail = {
      rechargedToID: this.rechargedToID,
      rechargedByID: this.user.userId
    };

    this.transactionReportService.getTransactionByUser(transactionDetail).subscribe((response) => {
      this.transactionData = response.data;
    });
  }

  onTerminalSelectTransferPoint(event: any){
    if (!event.value){
      this.terminalLimitForm.patchValue({beneficiaryUid: event});
      this.selectedTerminalTransferPoint = this.terminals.find(x => x.terminalId === event);
    }else{
      this.terminalLimitForm.patchValue({beneficiaryUid: event.value});
      this.selectedTerminalTransferPoint = this.terminals.find(x => x.terminalId === event.value);
    }
      // this.terminalLimitForm.controls.amount.setValidators([Validators.max(this.selectedTerminal.stockist.balance)]);
    // }else{
    //   this.selectedTerminal = this.terminals.find(x => x.terminalId === event.value);
    //   this.terminalLimitForm.controls.amount.setValidators([Validators.max(this.selectedTerminal.stockist.balance)]);
    // }
  }

  onTerminalSelect(event: any){

    if (!event.value){
      this.terminalLimitForm.patchValue({beneficiaryUid: event});
      this.selectedTerminal = this.terminals.find(x => x.terminalId === event);
      // console.log(this.selectedTerminal);
    }else{
      this.terminalLimitForm.patchValue({beneficiaryUid: event.value});
      this.selectedTerminal = this.terminals.find(x => x.terminalId === event.value);
    }

      // this.terminalLimitForm.controls.amount.setValidators([Validators.max(this.selectedTerminal.stockist.balance)]);
    // }else{
    //   this.selectedTerminal = this.terminals.find(x => x.terminalId === event.value);
    //   this.terminalLimitForm.controls.amount.setValidators([Validators.max(this.selectedTerminal.stockist.balance)]);
    // }
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

  approveLogin(terminal){
    this.masterTerminalService.loginApprove(terminal.terminalId).subscribe();
  }

  gamePermissionUpdate(gameId, terminalId){
    this.masterTerminalService.gamePermission(gameId, terminalId).subscribe();
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
    }else if (game_id === 6){
      this.game6 = (this.game6 === 1) ? 0 : 1;
    }
  }


  editTerminal(terminal){
    // this.highLightedRowIndex = this.terminals.findIndex(x => x.terminalId === terminal.terminalId);
    const data = {
      id: terminal.terminalId
      , terminalName: terminal.terminalName
      , stockistId: terminal.stockistId
      , superStockistId: terminal.superStockistId
      , payoutSlabId: terminal.payoutSlabId
      // , superStockistId: 8
      , pin: terminal.password
      , commission: terminal.commission
     };
    this.terminalMasterForm.patchValue(data);
    this.isTerminalUpdatAble = true;
  }

  passwordChecker(password){
    if(password == "1001"){
      return true;
    }else{
      return false;
    }
  }

  deleteTerminal(id){

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
      // console.log(result);
      if (result.isConfirmed) {
        if(this.passwordChecker(result.value)){
          this.masterTerminalService.deleteTerminalByAdmin(id).subscribe((response) => {
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

  refreshTerminalList(){
    this.masterTerminalService.getAllUpdatedTerminals();
  }

  updateTerminal(){

    const st = this.stockists.findIndex(x => x.userId === this.terminalMasterForm.value.stockistId);
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
          , superStockistId: this.terminalMasterForm.value.superStockistId
          , payoutSlabId: this.terminalMasterForm.value.payoutSlabId
          , pin: this.terminalMasterForm.value.pin
          , commission: this.terminalMasterForm.value.commission
          , userId: this.user.userId};
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

  selectSuperStockist(stockist){
    this.terminalMasterForm.patchValue({superStockistId: stockist.superStockistId});
    this.terminalMasterForm.value.superStockistId = stockist.superStockistId;
  }

  createNewTerminal() {

    const st = this.stockists.findIndex(x => x.userId === this.terminalMasterForm.value.stockistId);
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
        const masterData = {terminalName : this.terminalMasterForm.value.terminalName
          , stockistId: this.terminalMasterForm.value.stockistId
          , pin: this.terminalMasterForm.value.pin
          , superStockistId: this.terminalMasterForm.value.superStockistId
          , payoutSlabId: this.terminalMasterForm.value.payoutSlabId
          , createdBy: this.user.userId
          , commission: this.terminalMasterForm.value.commission
          , game1: this.game1
          , game2: this.game2
          , game3: this.game3
          , game4: this.game4
          , game5: this.game5
        };
        this.masterTerminalService.saveNewTerminal(masterData).subscribe(response => {
          if (response.success === 1){
            const responseData = response.data;
            this.game1 = 0;
            this.game2 = 0;
            this.game3 = 0;
            this.game4 = 0;
            this.game5 = 0;
            // this.terminals.unshift(responseData);
            // this.sortedTerminalList.unshift(responseData);
            this.highLightedRowIndex = 0;
            this.terminalMasterForm.reset();
            setTimeout(() => {
              this.highLightedRowIndex = -1;
            }, 5000);
            // @ts-ignore
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Terminal created',
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

  forceLogout(terminalId){
    this.masterTerminalService.forceLogoutTerminal(terminalId);
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
    this.highLightedRowIndex = -1;
    this.isTerminalUpdatAble = false;
  }

  shortOnline(){
    const data = this.terminals.slice();
    this.sortedTerminalList = data.sort((a, b) => {
      return compare(a.status, b.status, false);
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

    if (parseInt(this.terminalLimitForm.value.amount) > parseInt(String(this.selectedTerminalTransferPoint.stockist.balance))){
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

              this.sortedTerminalList[targetTerminalIndex].balance = responseData.balance;
              this.sortedTerminalList[targetTerminalIndex].stockist.balance = responseData.stockist.balance;
              const userBalance = this.user.balance - this.terminalLimitForm.value.amount;
              this.authService.setUserBalanceBy(userBalance) ;

              this.highLightedRowIndex = targetTerminalIndex;
              this.terminalLimitForm.controls.amount.setValidators([Validators.max(responseData.stockist.balance)]);
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
    // } else {
    //   Swal.fire({
    //     position: 'top-end',
    //     icon: 'error',
    //     title: 'Validation error',
    //     showConfirmButton: false,
    //     timer: 3000
    //   });
    // }
  }

  adjustPointToTerminal() {
    // if (this.terminalLimitForm.value.amount < this.user.balance){

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

    if (parseInt(this.terminalLimitForm.value.amount) > parseInt(String(this.selectedTerminal.balance))){
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

              this.sortedTerminalList[targetTerminalIndex].balance = responseData.balance;
              this.sortedTerminalList[targetTerminalIndex].stockist.balance = responseData.stockist.balance;
              const userBalance = this.user.balance - this.terminalLimitForm.value.amount;
              this.authService.setUserBalanceBy(userBalance) ;

              this.highLightedRowIndex = targetTerminalIndex;
              this.terminalLimitForm.controls.amount.setValidators([Validators.max(responseData.stockist.balance)]);
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
    // } else {
    //   Swal.fire({
    //     position: 'top-end',
    //     icon: 'error',
    //     title: 'Validation error',
    //     showConfirmButton: false,
    //     timer: 3000
    //   });
    // }
  }


  getTransactionDetails(){
    // console.log(this.transactionId);
    this.masterTerminalService.getTransactionDetails(this.transactionId).subscribe((response ) => {
      // @ts-ignore
      this.transactionDetails = response.data;
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
