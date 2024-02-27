import { Component, Injector } from "@angular/core";
import { AbpSessionService } from "abp-ng2-module";
import { AppComponentBase } from "@shared/app-component-base";
import { accountModuleAnimation } from "@shared/animations/routerTransition";
import { AppAuthService } from "@shared/auth/app-auth.service";

@Component({
  templateUrl: "./login.component.html",
  animations: [accountModuleAnimation()],
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends AppComponentBase {
  submitting = false;
  showpassword: boolean = true;
  constructor(
    injector: Injector,
    public authService: AppAuthService,
    private _sessionService: AbpSessionService
  ) {
    super(injector);
  }
  get multiTenancySideIsTeanant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }

    return true;
  }
  showHidePswrd() {
    this.showpassword = !this.showpassword;
  }
  login(): void {
    if (
      this.authService.authenticateModel.password == "" ||
      this.authService.authenticateModel.userNameOrEmailAddress == ""
    ) {
      this.notify.info("Please Enter your PhoneNumber and Password");
    } else {
      this.submitting = true;
      this.authService.authenticate(() => (this.submitting = false));
    }
  }
}
