import { Component, Injector, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/app-component-base";
import {
  AccountServiceProxy,
  RegisterInput,
  RegisterOutput,
} from "@shared/service-proxies/service-proxies";
import { accountModuleAnimation } from "@shared/animations/routerTransition";
import { AppAuthService } from "@shared/auth/app-auth.service";
import { result } from "lodash-es";

@Component({
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  animations: [accountModuleAnimation()],
})
export class RegisterComponent extends AppComponentBase implements OnInit {
  model: RegisterInput = new RegisterInput();
  saving = false;
  id: any;
  constructor(
    public router: Router,
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private _router: Router,
    private authService: AppAuthService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.model.gender = "-1"
  }
  save(): void {
 
    
    this.saving = true;
    this._accountService
      .register(this.model)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((result: RegisterOutput) => {
        if (!result.canLogin) {
          this.id = result.id;
          this.notify.success(this.l("SuccessfullyRegistered"));
          this.router.navigate(["/account/otp/" + this.id]);
          return;
        }
        // Autheticate
        this.saving = true;
        this.authService.authenticateModel.userNameOrEmailAddress =
          this.model.userName;
        this.authService.authenticateModel.password = this.model.password;
        this.authService.authenticate(() => {
          this.saving = false;
        });
      });
    
    //this.router.navigate(['/account/otp/'+this.id])
  }

  login() {
    this.router.navigate(["/account/login"]);
  }

  register() {
    if( this.model.gender == "-1" || this.model.name==null ||this.model.name=='' || this.model.password==null ||this.model.password==''|| this.model.userName==null ||this.model.userName=='' || this.model.emailAddress==null ||this.model.emailAddress==''){      
      this.notify.info("Please  fill the required  fields.");
  }else{
    this.model.surname = this.model.surname!=null?this.model.surname:"";
    this._accountService.register(this.model).subscribe((result) => {
      if (!result.canLogin) {
        this.id = result.id;
        this.notify.success(this.l("OTP Sent Successfully"));
        this.router.navigate(["/account/otp/" + this.id]);
        return;
      }
    });
  }
  }
  showOtpPage() {
    this.router.navigate(["/account/otp/" + this.id]);
  }
}
