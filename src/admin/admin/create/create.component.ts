
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

import { CommonServiceServiceProxy, CreateUserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends AppComponentBase implements OnInit {
  admin: CreateUserDto = new CreateUserDto();

imageFile:any
isImageUpladedStatus:string='';
passwordValidationErrors: Partial<AbpValidationError>[] = [
  {
    name: 'pattern',
    localizationKey:
      'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
  },
];
confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
  {
    name: 'validateEqual',
    localizationKey: 'PasswordsDoNotMatch',
  },
];

  @Output() onSave = new EventEmitter<any>();

    constructor(public commonService: CommonServiceServiceProxy, injector: Injector, public bsModalRef: BsModalRef, private _adminService: UserServiceProxy, private _apiService: AppSessionService)
  {super(injector) }

  ngOnInit(): void {
    this.admin.isActive=true;
    this.admin.imageUrl='';
  }

  onUpload(file){
    if (file) {
      this.isImageUpladedStatus='start'
      file = {
        fileName: file[0].name,
        data: file[0]
      };
    }
    this.commonService.uploadImage(file).subscribe(res=>{
      this.isImageUpladedStatus='end'
      this.admin.imageUrl = res.showLink;
      this.imageFile = res.saveLink
      
    })
  }
  
  save(){
    this.admin.userName = this.admin.phoneNumber;
    if(this.admin.name==null ||this.admin.emailAddress==null || this.admin.phoneNumber==null ||this.admin.password==null){
      this.notify.info("Please fill the required field.")
    }
    else{
    this._apiService.loading.next(true);
    // this.admin.password="123qwe";
   this.admin.imageUrl = this.imageFile;
   this.admin.surname=this.admin.surname!=null?this.admin.surname:" ";
   this.admin.roleNames=  ['Admin'];
   this._adminService.create(this.admin).subscribe(res=>{
      this.notify.info(this.l('SavedSuccessfully'));
      this.bsModalRef.hide();
      this._apiService.loading.next(false);
      this.onSave.emit();
    })
  }
}


}

