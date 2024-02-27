import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ChangePasswordDto,
  UserServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { CommonService } from '@shared/helpers/common.service';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AppSessionService } from '@shared/session/app-session.service';
import {  BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: './change-password.component.html',
  animations: [appModuleAnimation()]
})
export class ChangePasswordComponent extends AppComponentBase {
  saving = false;
  changePasswordDto = new ChangePasswordDto();
  newPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
        'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];
  confirmNewPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef, private common:CommonService,
    private userServiceProxy: UserServiceProxy,
    private router: Router,
    private authService: AppAuthService,
    private _sessionService: AppSessionService,

  ) {
    super(injector);
  }

   ngOnInit(): void {
    var navContent = { title: "Update Password", lengthh: -1 }
    this.common.pageTitle.next(navContent)
   }

  changePassword() {
    let user = this._sessionService.user;
    this.saving = true;
    this.userServiceProxy
      .changePassword(this.changePasswordDto)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((success) => {
        if (success) {
          this.authService.authenticateModel.userNameOrEmailAddress = user.emailAddress;
          this.authService.authenticateModel.password = this.changePasswordDto.newPassword;
          this.authService.authenticate(() => {
          this.saving = false;
          });
          abp.message.success('Password changed successfully', 'Success');
          this.router.navigate(['/app/home']);
        }
      });
  }
}
