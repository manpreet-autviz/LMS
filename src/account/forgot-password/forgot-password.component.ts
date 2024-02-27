import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AccountServiceProxy } from '@shared/service-proxies/service-proxies';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends AppComponentBase implements OnInit {
  userName: any;
  Swal: any;
  private _modalService: any;
  constructor(injector: Injector, public router: Router, private _accountService: AccountServiceProxy) { super(injector) }

  ngOnInit(): void {
    
  }
   send() {
   abp.message.success(
     this.l("OTP sent to your E-mail.."),
      undefined,
      this._accountService.forgotPassword(this.userName).subscribe(res => {
        this.router.navigate(['/account/login']);
        return;
      })
    );
  }
}




