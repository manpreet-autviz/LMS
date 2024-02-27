import { Component, ChangeDetectionStrategy, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '@app/users/change-password/change-password.component';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { CommonService } from '@shared/helpers/common.service';
import { JobNotificationDto, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { EditAdminProfileComponent } from 'admin/admin-profile/edit-admin-profile/edit-admin-profile.component';
import { UpdatePasswordComponent } from 'admin/admin-profile/update-password/update-password.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'header-user-menu',
  templateUrl: './header-user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserMenuComponent extends AppComponentBase implements OnInit {
  userDetails: any;
  tenantName: any
  user: UserDto = new UserDto();
  userRoles: any = []
  jobsNoti: JobNotificationDto = new JobNotificationDto();
  pic: any;
  id: any;

  constructor(

    injector: Injector,
    private route: Router,
    private _authService: AppAuthService,
    private _userService: UserServiceProxy,
    private _sessionService: AppSessionService,
    public bsModal: BsModalService,
    private _cdr: ChangeDetectorRef,
    private _commonService: CommonService
  ) {
    super(injector)
    this._commonService.commonFilters.subscribe((res) => {
      this.getAllMyProfile();
    });
  }



  ngOnInit() {
    this.userDetails = this._sessionService.user;
    this.tenantName = this.appSession.tenant.tenancyName;
    this.getAllMyProfile();

  }
  getAllMyProfile() {
    this._userService.get(this._sessionService.userId).subscribe((res) => {
      this.user = res;
      this.pic = res.pofileImage ;
      this._cdr.detectChanges();
    });
  }


  logout(): void {
    this._authService.logout();
    
  }
  myprofile(): void {
    if (this.userRoles.includes('ADMIN')) {
      this.route.navigate(['app/admin-profile'])
    }
    else {
      this.route.navigate(['app/student/student-profile'])
    }
  }

  UpdateDialog(id?: number): void {
    let createOrEditTenantDialog: BsModalRef;

    createOrEditTenantDialog = this.bsModal.show(
      ChangePasswordComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        initialState: {
          id: id,
        },
      }
    );
  }

  notification() {
    if (this.userRoles.includes('ADMIN')) {
      this.route.navigate(['app/jobnotification'])
    }
    else {
      this.route.navigate(['app/student/job-notification'])
    }
  }
}
