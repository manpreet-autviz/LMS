import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { SyllabusDto, CourseManagementDto, SyllabusServiceProxy, TopicsDto, TopicsServiceProxy, CourseManagementAppServicesServiceProxy, CategoryAppServicesServiceProxy, SubjectServiceServiceProxy, CategoryDto, CreateSyllabusDto } from '@shared/service-proxies/service-proxies';
import { cloneDeep } from 'lodash-es';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TreeSelect } from 'primeng/treeselect';

@Component({
  selector: 'app-edit-syllabus',
  templateUrl: './edit-syllabus.component.html',
  styleUrls: ['./edit-syllabus.component.scss']
})
export class EditSyllabusComponent extends AppComponentBase implements OnInit {
  syllabus:SyllabusDto = new SyllabusDto();
  topics: TopicsDto = new TopicsDto();
  course: CourseManagementDto = new CourseManagementDto();
  id : any = [];
  allSyllabus: any = [];
  allTopics: any = [];
  allCourses: any = [];
  allCategories:any[];
  allSubjectItems:any = [];
  dropdownSettings;
  allDepartments = [];
  selectedTopics: any = [];
  treeData: any;
  selectedNode: any;
  selectedCategory: any;
  placeholder:any

  @ViewChild(TreeSelect) ptree: TreeSelect;
  @Output() onSave = new EventEmitter<any>();
  constructor(injector: Injector, private activeRouter : ActivatedRoute,private router: Router, private _courseService: CourseManagementAppServicesServiceProxy
    ,private _categoryService:CategoryAppServicesServiceProxy,private _subService:SubjectServiceServiceProxy,private commonService:CommonService,
    private _topicService: TopicsServiceProxy,private _syllabusService:SyllabusServiceProxy) { super(injector) }

  ngOnInit(): void {
    this.activeRouter.params.subscribe(params =>{
      this.id = params.id;
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
   
    this.getAllSyllabus();
    this.getAllCategories();
    //this.getAllSubItems();
    //this.getSelectedTopics();
    var navContent = { title: "Manage Syllabus", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
  }
  getAllCourses() {
   
    this._courseService.getAllCoursesBasedOnCategory(this.syllabus.categoryId).subscribe(
      res => {
        this.allCourses = res;
      
      })
  }
  getAllSyllabus() {
    this._syllabusService.get(this.id).subscribe(
      res => {
        this.syllabus = res;
    
        this.getAllTopics(this.syllabus.subjectId,"ts");
        this._categoryService.get(res.categoryId).subscribe(category=>{
          this.placeholder=category.categoryName;
          
        })
        this.getAllCourses();
        this.getAllSubItems();
        //this.getAllTopics(this.syllabus.subjectId,"ts");
        
      })
  }

  getAllTopics(subjectId:any,methodCallFrom?){
    if(subjectId!=undefined || methodCallFrom != undefined){
    this.selectedTopics = [];
    this._topicService.getTopicsBySubject(subjectId).subscribe(res=>{
      this.allTopics = res;
      if(  methodCallFrom=='ts'){
        this.getSelectedTopics();
      }
      
    })
  }
  }
  
  getSelectedTopics(){
    this._syllabusService.getSyllabusesTopics(this.id).subscribe((res:any)=>{
    this.selectedTopics= res;
    })
  }
  getAllCategories() {
    this._categoryService.getAll("", 0, 1000).subscribe(
      res => {
        this.allCategories = res.items;
        this.getParentChildData();
      })
  }
  
  getParentChildData() {
    this.treeData = cloneDeep(this.allCategories.filter(x => x.parentId == null));
    this.treeData.forEach(element => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      element["children"] = this.allCategories.filter(x => x.parentId == element.id);
      this.getChildrenData(element["children"])
    });
  }

  getChildrenData(data) {
    data.forEach(element => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      if (element.linkedId != -1) {
        element["children"] = this.childrenTree(element.id);
      }
    });
  }

  childrenTree(id) {
    var children = this.allCategories.filter(c => c.parentId == id);
    children.forEach(element => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      if (element.linkedId != -1) {
        element["children"] = this.childrenTree(element.id);
      }
    });
    return children;
  }

  setCategory(id) {
    this.syllabus.categoryId = id;
    this.syllabus.courseManagementId=-1;
    this.getAllCourses();
  }
  getAllSubItems(){
    this._subService.getAll('',0,100).subscribe(res=>{
      this.allSubjectItems = res.items;
    })
  }

  save() {
    var updateSyllabus = new CreateSyllabusDto();
    updateSyllabus.syllabus = this.syllabus;
    updateSyllabus.topicsId = this.selectedTopics.map(q=>q.id);
    this._syllabusService.updateMultipleTopics(updateSyllabus).subscribe(res => {
      this.notify.info(this.l('SavedSuccessfully'));
      this.onSave.emit();
      this.router.navigate(['/app/syllabus']);
    })
  }

cancel(){
  this.router.navigate(['/app/syllabus']);
}
}
