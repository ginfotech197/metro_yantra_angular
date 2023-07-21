import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-admin-reset-password',
  templateUrl: './admin-reset-password.component.html',
  styleUrls: ['./admin-reset-password.component.scss']
})
export class AdminResetPasswordComponent implements OnInit {


  cPanelPasswordResetForm: UntypedFormGroup;

  screenWidth: any;  
  screenHeight: any;

  constructor(private commonService: CommonService) {
    this.screenWidth = window.innerWidth;  
    this.screenHeight = window.innerHeight;
   }

  ngOnInit(): void {

    this.cPanelPasswordResetForm = new UntypedFormGroup({
      oldPassword: new UntypedFormControl(null, [Validators.required]),
      newPassword: new UntypedFormControl(null, [Validators.required]),
      confirmedPassword: new UntypedFormControl(null, [Validators.required]),
    });
  }
  resetPassword(){
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(this.cPanelPasswordResetForm.value.oldPassword).end();
    if(this.cPanelPasswordResetForm.value.newPassword != this.cPanelPasswordResetForm.value.confirmedPassword){
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'New password and Confirmed password did not match',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    this.commonService.resetPassword(passwordMd5, this.cPanelPasswordResetForm.value.confirmedPassword).subscribe((response) => {
      if (response.success === 1){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Password changed',
          showConfirmButton: false,
          timer: 2000
        });
      }
      this.cPanelPasswordResetForm.reset();
    });
  }



}
