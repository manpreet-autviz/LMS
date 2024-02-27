import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-admin-profile',
  templateUrl: './edit-admin-profile.component.html',
  styleUrls: ['./edit-admin-profile.component.css']
})
export class EditAdminProfileComponent extends AppComponentBase implements OnInit {

  myprofile: UserDto = new UserDto();

  @Input() isDisabled: boolean = false;

  @Output() onSave = new EventEmitter<any>();

  dialogRef: any;
  dialog: any;
  saving: boolean;
  user: any;
  isImageUpladedStatus: string = "";
  imageFile: string;

  constructor(injector: Injector,
    public bsModalRef: BsModalRef,

    private _userService: UserServiceProxy,
    private _modalService: BsModalService,
    private _sessionService: AppSessionService,
    private router: Router
  ) {
    super(injector);
  }


  ngOnInit(): void {

    this.getAllMyProfile();


  }

  getAllMyProfile() {
    this._userService.get(this._sessionService.userId).subscribe((res) => {
      this.myprofile = res;
    });
  }


  save() {
    if (this.myprofile.name == "" || this.myprofile.surname == "" || this.myprofile.emailAddress == "" || this.myprofile.phoneNumber == "") {
      this.notify.info("Please enter the required fields")
    }
    else {
      this._userService.update(this.myprofile).subscribe(res => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      })
    }
  }



  cancel() {
    //this._userService.clear();
  }


}

