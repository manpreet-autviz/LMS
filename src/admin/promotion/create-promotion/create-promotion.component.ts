import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonServiceServiceProxy, PromotionDto, PromotionServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-promotion',
  templateUrl: './create-promotion.component.html',
  styleUrls: ['./create-promotion.component.css']
})
export class CreatePromotionComponent extends AppComponentBase implements OnInit {
  promotion: PromotionDto = new PromotionDto;
  isImageUpladedStatus: string = "";
  imageFile: string;
  @Output() onSave = new EventEmitter<any>();
  constructor(injector: Injector, public bsModalRef: BsModalRef, private _promotionservice:PromotionServiceProxy,
    public commonService: CommonServiceServiceProxy,) {
    super(injector);
  }

  ngOnInit(): void {
    this.promotion.image = "";
  }

  save() {
    if (this.promotion.title == null || this.promotion.image == null || this.promotion.image == "" || this.imageFile == "" ) {
      this.notify.info("Please Fill the Required Fields")
    }
    else {
     this.promotion.image = this.imageFile;
      this._promotionservice.create(this.promotion).subscribe((res => {
        this.promotion = res;
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit()
      }))
    }

  }

  onUpload(file) {
    
    if (file) {
      this.isImageUpladedStatus = "start";
      file = {
        fileName: file[0].name,
        data: file[0],
      };
    }
    this.commonService.uploadImage(file).subscribe((res) => {
      this.isImageUpladedStatus = "end";
      this.promotion.image = res.showLink;
      this.imageFile = res.saveLink;
    });
  }


}
