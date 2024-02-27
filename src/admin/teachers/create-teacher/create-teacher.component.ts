import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonServiceServiceProxy, CreateUserDto, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.css']
})
export class CreateTeacherComponent extends AppComponentBase implements OnInit {
  user: CreateUserDto = new CreateUserDto();
  @Output() onSave = new EventEmitter<any>();
  isImageUpladedStatus: string = '';
  imageFile: string;
  constructor(public commonService: CommonServiceServiceProxy,
    injector: Injector, public bsModalRef: BsModalRef,
    private _userService: UserServiceProxy,
    private _apiService: AppSessionService) { super(injector) }

  ngOnInit(): void {
    this.user.gender = "-1"
    this.user.isActive = true;
    this.user.imageUrl = '';
  }
  save() {
    this.user.userName = this.user.phoneNumber;
    if (this.user.name == null  || this.user.gender == "-1" || this.user.phoneNumber == null || this.user.emailAddress == null || this.user.password == null) {
      this.notify.info("Please Fill The Required Field")
    }
    else {
      this._apiService.loading.next(true);
      // this.user.password="123qwe";
      this.user.imageUrl = this.imageFile;
      this.user.surname = this.user.surname != null ? this.user.surname : " ";
      this.user.roleNames = ['Teacher'];
      // this.user.isActive=true;
      this._userService.create(this.user).subscribe(res => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this._apiService.loading.next(false);
        this.onSave.emit();
      },(err)=>{
        this._apiService.loading.next(false);
      });
    }
  }
  onUpload(file) {
    if (file) {
      this.isImageUpladedStatus = 'start'
      file = {
        fileName: file[0].name,
        data: file[0]
      };
    }
    this.commonService.uploadImage(file).subscribe(res => {
      this.isImageUpladedStatus = 'end'
      this.user.imageUrl = res.showLink;
      this.imageFile = res.saveLink
    })
  }
}

