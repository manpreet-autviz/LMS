import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CategoryAppServicesServiceProxy, CategoryDto, MultiCategoryDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { cloneDeep } from 'lodash-es';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent extends AppComponentBase implements OnInit {
  id:any;
category:CategoryDto=new CategoryDto();
multicategory:MultiCategoryDto=new MultiCategoryDto();
parentCategory:any=[];
data:any=[];
parentCategoryWithNullParentId: any = [];
@Output() onSave=new EventEmitter<any>();

  constructor(injector:Injector,public bsModalRef:BsModalRef,private _categoryService:CategoryAppServicesServiceProxy, private _apiService: AppSessionService) { super(injector)}

  ngOnInit(): void {
    this.getCategoryByParent();
    this.getparentCategory();
  }
  getparentCategory(){
    this._categoryService.getAll("",0,100).subscribe(res=>{
      this.parentCategory=res.items;
      this.parentCategoryWithNullParentId=cloneDeep(this.parentCategory);
      this.parentCategoryWithNullParentId=this.parentCategoryWithNullParentId.filter(x=>x.parentId==null);
    })
    }
  getCategoryByParent(){
    this._categoryService.get(this.id).subscribe(res=>{
      this.category=res;
    })
  }
  trimStart(category){
    category.categoryName = category.categoryName.trimStart();
  }
  save(){
    this._apiService.loading.next(true);
    var spaceCheck=this.category.categoryName.trim();
    if(this.category.categoryName==null||spaceCheck==""){
      this.notify.info("Please Fill The Required Field");
    }
    else{
      this._categoryService.updateCategory(this.category).subscribe(res=>{
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this._apiService.loading.next(false);
        this.onSave.emit();
      })
    }   
   }  
}
