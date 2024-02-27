import { Component,EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonServiceServiceProxy, CreateUserDto, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent extends AppComponentBase implements OnInit {
  id:any;
  user:UserDto=new UserDto();
  // create:CreateUserDto=new CreateUserDto();
@Output() onSave=new EventEmitter<any>();
  isImageUpladedStatus: string;
  imageFile: string;
    constructor(public commonService: CommonServiceServiceProxy, injector:Injector,public bsModalRef:BsModalRef,private _service:UserServiceProxy, private _apiService: AppSessionService) {super(injector) }

  ngOnInit(): void {
    this.getStudents();
  }
  getStudents(){
    this._service.get(this.id).subscribe(res=>{
      this.user=res;
      this.imageFile=this.user.pofileImage
    })
  }
 save(){
 // this.user.userName = this.user.phoneNumber;
  if(this.user.pofileImage == '')
  {
 this.imageFile = '';
  }
  this._apiService.loading.next(true);
  this.user.pofileImage = this.imageFile;
  this._service.update(this.user).subscribe(res=>{
    
    this.notify.info(this.l('SavedSuccessfully'));
    this.bsModalRef.hide();
    this._apiService.loading.next(false);
    this.onSave.emit();
  },(err)=>{
    this._apiService.loading.next(false);
  });
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
    this.user.pofileImage = res.showLink;
    this.imageFile = res.saveLink
    
  })
}

}
