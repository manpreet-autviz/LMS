import { Component, OnInit, Injector, Output, EventEmitter } from "@angular/core";
import { UserDto, UserServiceProxy } from "@shared/service-proxies/service-proxies";
import {  BsModalService } from "ngx-bootstrap/modal";
import { AppComponentBase } from "@shared/app-component-base";
import { AppSessionService } from "@shared/session/app-session.service";
import { Router } from "@angular/router";


@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.css"],
})
export class MyProfileComponent extends AppComponentBase implements OnInit {
  myprofile: UserDto=new UserDto();
  isImageUplodedStatus: string;
  imageFile: any;
  saving: boolean;
   @Output() update = new EventEmitter<any>();
  router: any;

  constructor(
    injector: Injector,
    
    private _userService: UserServiceProxy,
    private _modalService: BsModalService,
    private _sessionService: AppSessionService
  ) {
    super(injector);
  }
  user: any = [];

  ngOnInit(): void {
    
  }

  getAllMyProfile() {
    this._userService.get(this._sessionService.userId).subscribe((res) => {
      this.user = res;
    });
  }

  
  
  updateProfile()
  {

    this._userService.update(this.myprofile).subscribe((res)=>{
      this.user=res;

    })
  }


 onUpload(file) {
    if (file) {
      this.isImageUplodedStatus = "start";
      file = {
        fileName: file[0].name,
        data: file[0],
      };
    }
    this._userService.uploadImage(file).subscribe((res) => {
      this.isImageUplodedStatus = "end";
      this.user.pofileImage = res.showLink;
      this.imageFile = res.saveLink;
    });
  }
  
  back(){
 this.router.navigate(['/app/my-profile']);
 }
  
}
  
  
  
