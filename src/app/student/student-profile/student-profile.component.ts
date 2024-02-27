import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResetPasswordDialogComponent } from '@app/users/reset-password/reset-password.component';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { CommonServiceServiceProxy, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { clone, cloneDeep } from 'lodash-es';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditstudentprofileComponent } from './editstudentprofile/editstudentprofile.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent extends AppComponentBase implements OnInit {
  myprofile: UserDto=new UserDto();
  boolean: any[];

  constructor( injector: Injector,
    
    private _userService: UserServiceProxy,
    private _modalService: BsModalService,
    private _sessionService: AppSessionService,
    private router : Router,
    private commonService:CommonServiceServiceProxy,private common:CommonService
    ) {super(injector) }
    user: any = [];

  ngOnInit(): void {
    var navContent = { title: "My Profile", lengthh: -1 }
    this.common.pageTitle.next(navContent)
    this.getAllMyProfile();
  }
getAllMyProfile() {
    this._userService.get(this._sessionService.userId).subscribe((res) => {
      this.user = res;
    });
  }

  openImageSelectorBox(){
    document.getElementById('inputFileBtn').click();
  }
onUpload(file) {
    if (file) {
      file = {
        fileName: file[0].name,
        data: file[0],
      };
    }
    this.commonService.uploadImage(file).subscribe((res) => {
      this.upDateProfileImage(res.saveLink);
      this.user.pofileImage = cloneDeep(res.showLink);
    });
  }
  upDateProfileImage(link){
 
    this._userService.updateProfileImage(link).subscribe(res=>{
    this.notify.success("Profile Image Sucessfully Updated"); 
    this.common.commonChanges();
   
   })
    
  }

  
showCreateOrEditDialog(id?: number): void {
    let createOrEditTenantDialog: BsModalRef;
 
      createOrEditTenantDialog = this._modalService.show(
        EditstudentprofileComponent,
        {
          class: 'modal-lg modal-dialog-centered',
          initialState: {
            id: id,
          },
        }
      );
      createOrEditTenantDialog.content.onSave.subscribe(() => {
        this.getAllMyProfile(); 
      });
      }

  //     private showResetPasswordUserDialog(id?: number): void {
  //   this._modalService.show(ResetPasswordDialogComponent, {
  //     class: 'modal-lg',
  //     initialState: {
  //       id: id,
  //     },
  //   });
  // }
  UpdateDialog(id?: number): void {
    let createOrEditTenantDialog: BsModalRef;
 
      createOrEditTenantDialog = this._modalService.show(
        UpdatePasswordComponent,
        {
          class: 'modal-lg modal-dialog-centered',
          initialState: {
            id: id,
          },
        }
      );
      }

}
