import { Component,EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CategoryAppServicesServiceProxy, CategoryDto, MultiCategoryDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { cloneDeep } from 'lodash-es';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent extends AppComponentBase implements OnInit {
category:MultiCategoryDto=new MultiCategoryDto();
parentCategory:any=[];
parentCategoryWithNullParentId: any = [];
data=""
  treeData: any;
@Output() onSave=new EventEmitter<any>();
  constructor(public bsModalRef:BsModalRef,private _categoryService:CategoryAppServicesServiceProxy,injector:Injector, private _apiService: AppSessionService)
   {super(injector);
 
  }
  ngOnInit(): void {
     this.category.parentId=-1;
    this.category.parentId=null;
    this.getparentCategory();
    this.add();
  }
save(){
 this._apiService.loading.next(true);
  if (this.checkValidCategory()){
    this._categoryService.addMultiCategory(this.category).subscribe(res=>{

      this.notify.info(this.l('SavedSuccessfully'));
      this.bsModalRef.hide();
      this._apiService.loading.next(false);
      this.onSave.emit();
    })
  }
}
add(){
  var categoryDto = new CategoryDto();
  categoryDto.categoryName=''
  if(this.category.categories==null){
   this.category.categories=[];
  }
 
  this.category.categories.push(categoryDto)
 }
 delDesignation(index:number)
   {
        this.category.categories.splice(index, 1);
   }
 
getparentCategory(){
this._categoryService.getAll("",0,100).subscribe(res=>{
  this.parentCategory=res.items;

  this.parentCategoryWithNullParentId = cloneDeep(this.parentCategory);
  this.parentCategoryWithNullParentId = this.parentCategoryWithNullParentId.filter(x=>x.parentId == null);

})
}

 trimStart(data){
  data.categoryName = data.categoryName.trimStart();
}
checkValidCategory(){
   var isInvalid = false
  this.category.categories.forEach(item=>{
    var spaceCheck = item.categoryName.trim();
    if(item.categoryName==null || spaceCheck=='')
    {
      this.notify.info("Please Fill the Required Fields")
     
      isInvalid = true
    }
  })
  if(isInvalid)
  {
    return false;
  }
  else{
    return true;
  }
  
}
  changeCategory(){
  this.category.parentId=<any>this.data;
}
}
