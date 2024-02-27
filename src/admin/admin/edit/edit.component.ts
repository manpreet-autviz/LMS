import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonServiceServiceProxy, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent extends AppComponentBase implements OnInit {
  id: any;
  imageFile:any;
  isImageUpladedStatus:string='';
admin: UserDto = new UserDto();
  @Output() onSave = new EventEmitter<any>();
    constructor(public commonService: CommonServiceServiceProxy, injector: Injector, public bsModalRef: BsModalRef, private _adminService:UserServiceProxy, private _apiService: AppSessionService)
  {super(injector) }


  ngOnInit(): void {
    this.getAdmin();
  }
  getAdmin(){
    this._adminService.get(this.id).subscribe(res=>{
      this.admin = res;
      this.imageFile=this.admin.pofileImage
    })
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
      this.admin.pofileImage = res.showLink;
      this.imageFile = res.saveLink
      
    })
  }
  
  save(){
    if(this.admin.pofileImage == '')
    {
   this.imageFile = '';
    }
    this._apiService.loading.next(true);
    this.admin.pofileImage = this.imageFile;
    this._adminService.update(this.admin).subscribe(res=>{
      this.notify.info(this.l('SavedSuccessfully'));
      this.bsModalRef.hide();
      this._apiService.loading.next(true);
      this.onSave.emit();
    })
  }
}

