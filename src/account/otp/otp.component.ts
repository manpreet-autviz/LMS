import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { AppAuthService } from "@shared/auth/app-auth.service";
import {
  AccountServiceProxy,
  UserDto,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
})
export class OtpComponent extends AppComponentBase implements OnInit {
  user: UserDto = new UserDto();
  id: any;
  otp: string;
  saving: boolean;
  constructor(
    private authService: AppAuthService,
    injector: Injector,
    public router: Router,
    private activeRouter: ActivatedRoute,
    private _service: UserServiceProxy,
    private _accountService: AccountServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params) => {
      this.id = params.id;
      if (Boolean(params.otp)) {
        this.otp = params.otp;
        this.confirmOtp();
      }
    });
  }

  confirmOtp() {
    if (this.otp == null||this.otp == '' ) {
      this.notify.info("Please Provide OTP...!!!");
    }else{
    this._service
      .confirmEmail(this.id, this.otp.toString())
      .subscribe((res) => {
        if (res != null) {
          this.notify.success(this.l("Successfully Registered"));
          this.saving = true;
          this.authService.authenticateModel.userNameOrEmailAddress =
            res.userName;
          this.authService.authenticateModel.password = res.normalPassword;
          this.authService.authenticate(() => {
            this.saving = false;
          });
          this.router.navigate(["/app/home"]);
        } else {
          this.notify.info("Incorrect OTP...!!!");
        }
      });
    }
  }

  resendOtp() {
    this._accountService.resendOtp(this.id).subscribe((res) => {
      this.notify.info("OTP Send Successfully");
    });
  }
}
