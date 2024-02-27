import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { CategoryAppServicesServiceProxy, CategoryDto, CourseManagementAppServicesServiceProxy, CourseManagementDto, CreateSyllabusDto, MultiTopicDto, SubjectServiceServiceProxy, SyllabusDto, SyllabusServiceProxy, TopicsDto, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { cloneDeep } from 'lodash-es';
import { BsModalRef } from 'ngx-bootstrap/modal';



@Component({
  selector: 'app-create-syllabus',
  templateUrl: './create-syllabus.component.html',
  styleUrls: ['./create-syllabus.component.scss']
})
export class CreateSyllabusComponent extends AppComponentBase implements OnInit {
  syllabus: SyllabusDto = new SyllabusDto();
  course: CourseManagementDto = new CourseManagementDto();
  createSyllabusTopics: CreateSyllabusDto = new CreateSyllabusDto();
  allSyllabus: any = [];
  allTopics: any = [];
  allCourses: any = [];
  allCategories: any[];
  allSubjectItems: any = [];
  selectedTopic: any = "";
  selectedUsers: [] = [];
  dropdownSettings;

  allDepartments = [];
  selectedTopics: [] = [];
  selectedSubject: [] = [];
  treeData: any;
  selectedNode: any
  selectedCategory: any
  loading = false;

  @Output() onSave = new EventEmitter<any>();
  constructor(injector: Injector, private router: Router, private _courseService: CourseManagementAppServicesServiceProxy,private commonService:CommonService,
    private _topicService: TopicsServiceProxy, private _categoryService: CategoryAppServicesServiceProxy, private _syllabusService: SyllabusServiceProxy, private _subService: SubjectServiceServiceProxy, private _apiService: AppSessionService) { super(injector) }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All ',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.syllabus.categoryId = -1;
    this.syllabus.courseManagementId = -1;
    this.syllabus.subjectId = -1;
    this.syllabus.level="";

    this.getAllTopics(this.syllabus.subjectId);
  
    this.getAllSyllabus();
    this.getAllCategories();
    this.getAllSubItems();
    var navContent = { title: "Manage Syllabus", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
  }

  onItemDeSelect() {
    this.getAllTopics(this.syllabus.subjectId);
  }
  getAllSyllabus() {
    this.loading = true;
    this._syllabusService.getAll("", 0, 1000).subscribe(
      res => {
        this.allSyllabus = res.items;
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
  }



  getAllCategories() {
    this.loading = true;
    this._categoryService.getAll("", 0, 100).subscribe(res => {
      this.allCategories = res.items;
      this.getParentChildData();
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }
  getParentChildData() {
    this.loading = true;
    this.treeData = cloneDeep(this.allCategories.filter(x => x.parentId == null));
    this.treeData.forEach(element => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      element["children"] = this.allCategories.filter(x => x.parentId == element.id);
      this.getChildrenData(element["children"])
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }
  getChildrenData(data) {
    this.loading = true;
    data.forEach(element => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      if (element.linkedId != -1) {
        element["children"] = this.childrenTree(element.id);
      }
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }
  childrenTree(id) {
    this.loading = true;
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
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
    return children;
  }

  setCategory(id) {
    
    this.syllabus.categoryId = id.node.id;
    this.syllabus.courseManagementId = -1;
    this.getAllCourses();
  }
  getAllSubItems() {
    this.loading = true;
    this._subService.getAll('', 0, 100).subscribe(res => {
      this.allSubjectItems = res.items;
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  // getAllTopics() {
  //   if(Boolean(this.selectedSubject.map((a:any)=>a.id))){
  //     this._topicService.getTopicsBasedOnSubject(this.selectedSubject.map((a:any)=>a.id)).subscribe(
  //       res => {this.allTopics = res;
  //       })
  //   }
  // }

  getAllCourses() {
    this.loading = true;
    this._courseService.getAllCoursesBasedOnCategory( this.syllabus.categoryId).subscribe(
      res => {
        this.allCourses = res;
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
  }

  getAllTopics(subjectId: any) {
    this.loading = true;
    this._topicService.getTopicsBySubject(subjectId).subscribe(res => {
      this.allTopics = res;
      let selectedFilterTopics: any = this.selectedTopics.filter((q: any) => this.allTopics.map(w => w.id).includes(q.id));
      this.selectedTopics = cloneDeep(selectedFilterTopics)
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  save() {  if( this.syllabus.level=="" ||this.syllabus.subjectId == -1|| this.syllabus.courseManagementId == -1|| this.syllabus.categoryId == -1){
    this.notify.info("Please Fill the Required Fields")
  }else{
    this._apiService.loading.next(true);
    this.createSyllabusTopics.syllabus = this.syllabus;
    this.createSyllabusTopics.topicsId = this.selectedTopics.map((a: any) => a.id)
    this._syllabusService.createSyllabus(this.createSyllabusTopics).subscribe(res => {
      this.notify.info(this.l('SavedSuccessfully'));
      this._apiService.loading.next(false);
      this.onSave.emit();
      this.router.navigate(['/app/syllabus']);
    },(err)=>{
      this._apiService.loading.next(false);
    });
  }
  }

  cancel() {
    this.router.navigate(['/app/syllabus']);
  }

}