import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-super-stockist-reset-password',
  templateUrl: './super-stockist-reset-password.component.html',
  styleUrls: ['./super-stockist-reset-password.component.scss']
})
export class SuperStockistResetPasswordComponent implements OnInit {

  superStockistPasswordResetForm: UntypedFormGroup;
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {

    this.superStockistPasswordResetForm = new UntypedFormGroup({
      oldPassword: new UntypedFormControl(null, [Validators.required]),
      newPassword: new UntypedFormControl(null, [Validators.required]),
      confirmedPassword: new UntypedFormControl(null, [Validators.required]),
    });
  }

  resetPassword(){
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(this.superStockistPasswordResetForm.value.oldPassword).end();
    if(this.superStockistPasswordResetForm.value.newPassword != this.superStockistPasswordResetForm.value.confirmedPassword){
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'New password and Confirmed password did not match',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    this.commonService.resetPassword(passwordMd5, this.superStockistPasswordResetForm.value.confirmedPassword).subscribe((response) =>{
      if (response.success === 1){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Password changed',
          showConfirmButton: false,
          timer: 2000
        });
      }
      this.superStockistPasswordResetForm.reset();
    });
  }

}
