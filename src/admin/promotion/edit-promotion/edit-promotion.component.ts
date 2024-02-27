import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonServiceServiceProxy, PromotionDto, PromotionServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-promotion',
  templateUrl: './edit-promotion.component.html',
  styleUrls: ['./edit-promotion.component.css']
})
export class EditPromotionComponent extends AppComponentBase implements OnInit {

  promotions:PromotionDto=new PromotionDto;
  isImageUpladedStatus: string = "";
  imageFile: string;
  id: any;


  @Output() onSave = new EventEmitter<any>();
  constructor(injector: Injector, private _promotionservice: PromotionServiceProxy, public bsModalRef: BsModalRef,
    public commonService: CommonServiceServiceProxy,) {
    super(injector);
   }

  ngOnInit(): void {
    this.promotions.image = "";
    this.getpromotion();
  }

 
  getpromotion(){
   
    this._promotionservice.get(this.id).subscribe((res)=>{
      this.promotions=res;
      this.imageFile=this.promotions.image;
    })
  }

  save(){
    
    if (this.promotions.title == null || this.promotions.image == null||this.promotions.image==""
      || this.imageFile == "") {
       this.notify.info("Please Fill the Required Fields")
     }
     else{
      this.promotions.image=this.imageFile;
     this._promotionservice.update(this.promotions).subscribe((res) => {
        this.promotions = res;
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit()
      })
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
      this.promotions.image = res.showLink;
      this.imageFile = res.saveLink;
    });
  }

}
