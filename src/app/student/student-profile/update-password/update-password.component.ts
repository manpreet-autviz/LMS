import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { ChangePasswordDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
  animations: [appModuleAnimation()]
})
export class UpdatePasswordComponent extends AppComponentBase {
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

  constructor(injector: Injector,
    private userServiceProxy: UserServiceProxy,
    public bsModalRef: BsModalRef,
    public route: Router,
    private _sessionService: AppSessionService,
    private router: Router, private authService: AppAuthService,) {
    super(injector);
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
          this.bsModalRef.hide();
          this.router.navigate(['/app/home']);
         }
        });
  }

}
