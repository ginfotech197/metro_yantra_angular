import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-stockist-reset-password',
  templateUrl: './stockist-reset-password.component.html',
  styleUrls: ['./stockist-reset-password.component.scss']
})
export class StockistResetPasswordComponent implements OnInit {
  stockistPasswordResetForm:UntypedFormGroup;

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {

    this.stockistPasswordResetForm = new UntypedFormGroup({
      oldPassword: new UntypedFormControl(null, [Validators.required]),
      newPassword: new UntypedFormControl(null, [Validators.required]),
      confirmedPassword: new UntypedFormControl(null, [Validators.required]),
    });
  }

  resetPassword(){
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(this.stockistPasswordResetForm.value.oldPassword).end();
    if(this.stockistPasswordResetForm.value.newPassword != this.stockistPasswordResetForm.value.confirmedPassword){
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'New password and Confirmed password did not match',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    this.commonService.resetPassword(passwordMd5, this.stockistPasswordResetForm.value.confirmedPassword).subscribe((response) => {
      if (response.success === 1){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Password changed',
          showConfirmButton: false,
          timer: 2000
        });
      }
      this.stockistPasswordResetForm.reset();
    });
  }

}
