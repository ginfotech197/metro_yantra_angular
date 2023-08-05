import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {AuthResponseData, AuthService} from '../../services/auth.service';
import {StorageMap} from '@ngx-pwa/local-storage';
import {Md5} from 'ts-md5';
import {Observable} from 'rxjs';
import {ActivatedRoute, Data, Router} from '@angular/router';
import { faAtlas} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import {User} from '../../models/user.model';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  faAtlas = faAtlas;
  loginForm: UntypedFormGroup;
  // tslint:disable-next-line:max-line-length
  loginType: string;
  public user: User;

  screenWidth: any;  
  screenHeight: any; 

  // tslint:disable-next-line:max-line-length
  constructor(private authService: AuthService, private storage: StorageMap, private router: Router, private activatedRoute: ActivatedRoute) {

    this.screenWidth = window.innerWidth;  
    this.screenHeight = window.innerHeight;
    console.log(this.screenWidth);
    
    const data: Data = this.activatedRoute.snapshot.data;
    this.loginType = data.loginType;
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl(null, [Validators.required]),
      password: new UntypedFormControl(null, [Validators.required]),
      remember: new UntypedFormControl(false),
    });

    const tempCheckLoginForm = JSON.parse(localStorage.getItem('loginData'));
    if (tempCheckLoginForm){
      this.loginForm.patchValue({email: tempCheckLoginForm.email, password: tempCheckLoginForm.password, remember: true});
    };

    this.user = this.authService.userBehaviorSubject.value;

    if (this.user != null){
      // tslint:disable-next-line:triple-equals
      if (this.user.userTypeId == 1){
        this.router.navigate(['/cPanel']).then(r => {});
      }
      // tslint:disable-next-line:triple-equals
      if (this.user.userTypeId == 2){
        this.router.navigate(['/developer']).then(r => {});
      }

      if (this.user.userTypeId == 3){
        this.router.navigate(['/superStockistDashboard']).then(r => {});
      }
      // tslint:disable-next-line:triple-equals
      if (this.user.userTypeId == 4){
        this.router.navigate(['/stockistCPanel']).then(r => {});
      }
      // tslint:disable-next-line:triple-equals
      if (this.user.userTypeId == 5){
        this.router.navigate(['/terminal']).then(r => {});
      }
    }
  }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(){

    if (this.loginForm.value.remember === false){
      localStorage.removeItem('loginData');
    }

    this.isLoading = true;
    let authObserable = new Observable<AuthResponseData>();
    // converting password to MD5
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(this.loginForm.value.password).end();
    // const formPassword = form.value.password;

    authObserable = this.authService.login({email: this.loginForm.value.email, password: passwordMd5, devToken: 'webTokenAccess'});
    // authObserable = this.authService.login({email: this.loginForm.value.email, password: passwordMd5, mac_address: '130' , devToken: 'unityAccessToken'});
    authObserable.subscribe(response => {

      // console.log('this.user: ');
      // console.log(response);
      // console.log(response.data.user.userTypeId);

      // tslint:disable-next-line:triple-equals
      if (response.success === 1){
        if (this.loginForm.value.remember === true){
          const loginData = {
            email : this.loginForm.value.email,
            password: this.loginForm.value.password
          };
          localStorage.setItem('loginData', JSON.stringify(loginData));
        }else{
          localStorage.removeItem('loginData');
        }
        this.isLoading = false;
        // tslint:disable-next-line:triple-equals
        if (response.data.user.userTypeId == 1){
          this.router.navigate(['/cpanel']).then(r => {});
        }
        // tslint:disable-next-line:triple-equals
        if (response.data.user.userTypeId == 2){
          this.router.navigate(['/developer']).then(r => {});
        }
        // tslint:disable-next-line:triple-equals
        if (response.data.user.userTypeId == 3){
          this.router.navigate(['/superStockistDashboard']).then(r => {});
        }
        if (response.data.user.userTypeId == 4){
          this.router.navigate(['/stockistCPanel']).then(r => {});
        }
        // tslint:disable-next-line:triple-equals
        if (response.data.user.userTypeId == 5){
          this.router.navigate(['/terminal']).then(r => {});
        }
      }else if (response.success === 2){
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'You are blocked',
          showConfirmButton: false,
          timer: 2000
        });
        this.isLoading = false;
      }else{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'User ID or Password is wrong',
          showConfirmButton: false,
          timer: 1000
        });
        this.isLoading = false;
      }
    }, (error) => {
      console.log(error.message);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: error.message,
        showConfirmButton: false,
        timer: 2000
      });
      this.isLoading = false;
    });
  }
}
