import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import {  CategoryAppServicesServiceProxy, CategoryDto, CourseManagementAppServicesServiceProxy, SubjectServiceServiceProxy, SyllabusDto, SyllabusServiceProxy, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { DataTableDirective } from 'angular-datatables';
import { cloneDeep } from 'lodash-es';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CreateSyllabusComponent } from './create-syllabus/create-syllabus.component';
import { EditSyllabusComponent } from './edit-syllabus/edit-syllabus.component';



@Component({
  selector: 'app-syllabus',
  templateUrl: './syllabus.component.html',
  styleUrls: ['./syllabus.component.scss']
})
export class SyllabusComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  title = 'datatables';
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 10,
    lengthMenu: [[10,50, 100, 200, 500,-1], [10,50, 100, 200, 500, "All"]],
    order: [],
};
posts;
dtTrigger: Subject<any> = new Subject<any>();
  allSyllabus : any=[];
  allTopics: any = [];
  allCourses : any[];
  allCategories:any[];
  allSubjectItems:any = [];
  treeData: any;
  selectedNode:any
  syllabus:SyllabusDto=new SyllabusDto();
  loading = false;
  constructor(injector: Injector,private commonService:CommonService,private _categoryService:CategoryAppServicesServiceProxy, private _syllabusService: SyllabusServiceProxy, private _topicService: TopicsServiceProxy,  private _courseService: CourseManagementAppServicesServiceProxy,private _subService:SubjectServiceServiceProxy,private router: Router  )
    { super(injector)}



 ngOnInit(): void {
    this.syllabus.categoryId=-1;
    this.getAllSyllabus(this.syllabus.categoryId);
    this.getAllCourses();
    this.getAllTopics();
    this.getAllSubItems();
    this.getAllCategories();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
 }

 ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
 }

  renderer(): void {
    if(this.dtElement && this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
       dtInstance.destroy();
        this.dtTrigger.next();
  
      });
    }
 }

 
  getAllSyllabus(categoryId: any){
    this.loading = true;
    this._syllabusService.getAllSyllabusesData(categoryId).subscribe(
      res=>{this.allSyllabus=res;
        var navContent = { title: "Syllabus Management", lengthh: this.allSyllabus.length }
      this.commonService.pageTitle.next(navContent)
        this.loading = false;
        this.renderer();
      },(err)=>{
        this.loading=false;
      });
    }
    getAllCategories(){
      this.loading = true;
      this._categoryService.getAll("",0,100).subscribe(res=>{
        this.allCategories=res.items;
        this.loading = false;
       this.getParentChildData();
      },(err)=>{
        this.loading=false;
      });
    }
    getParentChildData()
    {
      this.loading = true;
      var selectAllCategory = new CategoryDto();
      selectAllCategory.id = -1,
      selectAllCategory.categoryName = "All Category";
      this.allCategories.unshift(selectAllCategory);
      this.treeData =  cloneDeep(this.allCategories.filter(x=>x.parentId == null));
      this.treeData.forEach(element => {
        element["name"] = element.categoryName;
        element["label"] = element.categoryName;
        element["data"] = element;
       element ["expandedIcon"] = "pi pi-folder-open";
        element ["collapsedIcon"] = "pi pi-folder";
        element["children"] = this.allCategories.filter(x=>x.parentId == element.id);
        this.getChildrenData(element["children"])
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
    }
    getChildrenData(data)
    {
      this.loading = true;
      data.forEach(element => {
        element["name"] = element.categoryName;
        element["label"] = element.categoryName;
        element["data"] = element;
        element ["expandedIcon"] = "pi pi-folder-open";
        element ["collapsedIcon"] = "pi pi-folder";
        if (element.linkedId != -1) {
          element["children"] = this.childrenTree(element.id);
        }
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
    }
    
    childrenTree(id) {
      var children = this.allCategories.filter(c => c.parentId == id);
      children.forEach(element => {
        element["name"] = element.categoryName;
        element["label"] = element.categoryName;
        element["data"] = element;
        element ["expandedIcon"] = "pi pi-folder-open";
        element ["collapsedIcon"] = "pi pi-folder";
        if (element.linkedId != -1) {
          element["children"] = this.childrenTree(element.id);
        }
      });
      return children;
    }


  getAllSubItems(){
    this.loading = true;
    this._subService.getAll('',0,100).subscribe(res=>{
      this.allSubjectItems = res.items;
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  getAllTopics() {
    this.loading = true;
    this._topicService.getAllTopics().subscribe(
      res => {
        this.allTopics = res;
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
  }
 
  getAllCourses() {
    this.loading = true;
    this._courseService.getAll("", 0, 1000).subscribe(
      res => {
        this.allCourses = res.items;
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
  }



showCreateOrEditDialog(id?: number): void {
  this.loading = true;
    if (!id) {
      this.router.navigate(['/app/create-syllabus'])
    
    } else {
      this.router.navigate(['/app/edit-syllabus/'+id])
    }
    this.loading = false;
}

  delSyllabus(syllabus: any) {
    abp.message.confirm(
      this.l("This syllabus will be deleted...!!"),
      undefined,  
      (result: boolean) => {
        if (result) {
          this._syllabusService.delete(syllabus.id).subscribe(res => {
            this.notify.success("Deleted SuccessFully");
            this.getAllSyllabus(this.syllabus.categoryId);     
          });
        }
      }
    );
  }
}