import { Component, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { CategoryAppServicesServiceProxy, ContentManagementDto, ContentManagementServiceServiceProxy, ContentManagementSubjectsDto, CourseManagementAppServicesServiceProxy, CreateContentManagementDto, MockTestServiceProxy, SubjectDto, SubjectServiceServiceProxy, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { param } from 'jquery';
import { cloneDeep } from 'lodash-es';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TreeSelect } from 'primeng/treeselect';
import { AddNotesComponent } from '../create-contentmanagement/add-notes/add-notes.component';
import { AddVideosComponent } from '../create-contentmanagement/add-videos/add-videos.component';
import { EditNotesComponent } from './edit-notes/edit-notes.component';
import { EditVideoComponent } from './edit-video/edit-video.component';

@Component({
  selector: 'app-edit-contentmanagement',
  templateUrl: './edit-contentmanagement.component.html',
  styleUrls: ['./edit-contentmanagement.component.scss']
})
export class EditContentmanagementComponent extends AppComponentBase implements OnInit,OnDestroy {
  butDisabled = "disabled";
  courseType: any;
  id: any;
  videos: any[];
  notes: any[];
  allSubjectItems: any = [];
  allCourses: any = [];
  allTopics: any = [];
  allCategories: any = [];
  selectedTopics: [] = [];
  selectedSubjects: any = [];
  selectedMockTests: any = [];
  dropdownSettings;
  dropdownSetting;
  treeData: any;
  selectedNode: any;
  selectedCategory: any;
  placeholder: any
  isVideosAddes: boolean
  isNotesAddes: boolean;
  isCollapse = true;
  questions: any = [];
  allMockTests: any;
  loading = false;
  arr = [1, 3, 4, 5, 6]
  price:any;
  @ViewChild(TreeSelect) ptree: TreeSelect;
  @Output() onSave = new EventEmitter<any>();
  createContentManDto: CreateContentManagementDto = new CreateContentManagementDto();
  contentMang: ContentManagementDto = new ContentManagementDto();
  constructor(injector: Injector, private commonService: CommonService, public router: Router, public _modalService: BsModalService,
    private activatedRoute: ActivatedRoute, private _topicService: TopicsServiceProxy,
    private _subService: SubjectServiceServiceProxy, private _courseService: CourseManagementAppServicesServiceProxy,
    private _contentService: ContentManagementServiceServiceProxy, private _categoryService: CategoryAppServicesServiceProxy,
    private _apiService: AppSessionService,
    private _mockTestService: MockTestServiceProxy) { super(injector) }

    ngOnDestroy(): void {
      localStorage.removeItem('EditContentCoursPrice')
    }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params =>
      this.id = params.id);

    this.getAllSubItems();
    this.getAllCourses();
    //  this.getAllMockTestsBasedOnCourse();
    this.getTopics(this.contentMang.subjectId);
    this.getAllCategories();
    this.getAllSubject();
    this.getContentMang();
    this.getallContentVideos();
    this.getContentNotes();
    this.getContentQuestions();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
    this.dropdownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'subjectName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
    var navContent = { title: "Content Management", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
  }


  onSelectAll() {
    
    this._topicService.getAll('', 0, 100).subscribe((res: any) => {
      this.allTopics = res.items;
    })

  }
  onDeSelectItem() {
    
    if (Boolean(this.selectedSubjects.map((a: any) => a.id))) {
      this._topicService.getTopicsBasedOnSubject(this.selectedSubjects.map((a: any) => a.id)).subscribe(
        res => {
          this.allTopics = res;
          let selectedFilterTopics: any = this.selectedTopics.filter((q: any) => this.allTopics.map(w => w.id).includes(q.id));
          this.selectedTopics = cloneDeep(selectedFilterTopics)
        })
    }
  }
  onUnSelectAll() {
    
    this.selectedSubjects = [];
    this.selectedTopics = [];
    this.selectedSubjects = []
    this.allTopics = [];
  }
  onSelectItem() {
    
    if (Boolean(this.selectedSubjects.map((a: any) => a.id))) {
      this._topicService.getTopicsBasedOnSubject(this.selectedSubjects.map((a: any) => a.id)).subscribe(
        res => {
          this.allTopics = res;
        })
    }
  }
  getContentQuestions() {
    this._contentService.getContentQuestions(this.id).subscribe(res => {
      this.questions = res;
    })
  }

  getContentMang() {
    this.loading = true;
    this._contentService.get(this.id).subscribe(res => {
      this.contentMang = res;
      this.getSelectedCourseDetail(this.contentMang.courseManagementId);
      this._mockTestService.getAllMockTestBasedOnCourse(this.contentMang.courseManagementId).subscribe(res => {
        this.allMockTests = res;
      })
      this._categoryService.get(res.categoryId).subscribe(category => {
        this.placeholder = category.categoryName;
        this.getAllCourses();
      })
    })
    this._contentService.getContentSubjects(this.id).subscribe(res => {
      this.selectedSubjects = res;
      this.getAllTopics();
    })
    this._contentService.getContentMockTests(this.id).subscribe(res => {
      this.selectedMockTests = res;
      this.loading = false;
    })

  }

  getSelectetedTopics() {
    this._contentService.getContentTopics(this.id).subscribe((res: any) => {
      this.selectedTopics = res;

    })
  }
  getAllSubItems() {
    this._subService.getAll('', 0, 100).subscribe(res => {
      this.allSubjectItems = res.items;
    })
  }

  getAllTopics() {
    if (Boolean(this.selectedSubjects.map((a: any) => a.id))) {
      this._topicService.getTopicsBasedOnSubject(this.selectedSubjects.map((a: any) => a.id)).subscribe(
        res => {
          this.allTopics = res;
          this.getSelectetedTopics();
        })
    }
  }

  getTopics(subjectId: any) {

    this._topicService.getTopicsBySubject(subjectId).subscribe(res => {
      this.allTopics = res;
    })
  }
  getAllCourses() {
    this._courseService.getAllCoursesBasedOnCategory(this.contentMang.categoryId).subscribe(res => {
      this.allCourses = res;
    })
  }
  getAllMockTestsBasedOnCourse() {
    this._mockTestService.getAllMockTestBasedOnCourse(this.contentMang.courseManagementId).subscribe(res => {
      this.allMockTests = res;
      this.getSelectedCourseDetail(this.contentMang.courseManagementId)
      this.selectedMockTests = null;
    })
  }

  getSelectedCourseDetail(id: any) {
    this._courseService.get(id).subscribe(res => {
      this.courseType = res.type;
      this.price = res.price;
      localStorage.setItem('EditContentCoursPrice', JSON.stringify(this.price))
    })
  }
  getAllCategories() {
    this._categoryService.getAll("", 0, 100).subscribe(res => {
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
    this.contentMang.categoryId = id;
    this.contentMang.courseManagementId = 0;
    this.selectedMockTests = null;
    this.allMockTests = null;
    this.getAllCourses();
  }

  getAllSubject() {
    this.selectedSubjects = [];
    this._subService.getAll("", 0, 100).subscribe(res => {
      this.allSubjectItems = res;
      if (Boolean(this.contentMang.selectedSubjects?.length > 0)) {
        this.contentMang.selectedSubjects.forEach((item: SubjectDto) => {
          var subject = { "id": item.id, "title": item.subjectName }
          this.selectedSubjects.push(subject)
        })
      }
      this.selectedSubjects = cloneDeep(this.selectedSubjects);
    })
  }
  accordionCollapse() {
    this.isCollapse = !this.isCollapse;
  }
  save() { 
  
  if ((this.selectedMockTests == 0 && this.courseType == "Mock")) {
      this.notify.info("Please Add the Content Mocktests")
    }
    else {
     
    this._apiService.loading.next(true);
    this.createContentManDto.contentManagement = this.contentMang;
    this.createContentManDto.topicsId = this.selectedTopics.map((a: any) => a.id)
    this.createContentManDto.subjectId = this.selectedSubjects.map((a: any) => a.id)
    this.createContentManDto.mockTestId = this.selectedMockTests.map((a: any) => a.id)
    this._contentService.updateContentManagement(this.createContentManDto).subscribe(res => {
      this.notify.info(this.l('SavedSuccessfully'));
      this._apiService.loading.next(false);
      this.onSave.emit();
      localStorage.removeItem('EditContentCoursPrice')
      this.router.navigate(['/app/contentmanagements']);
    })
    }
  }
  cancel() {
    this.router.navigate(['/app/contentmanagements']);
  }
  getallContentVideos() {
    this._contentService.getContentVideos(this.id, false).subscribe(res => {
      this.createContentManDto.contentManagementVideos = res;
    })
  }
  addVideos(id?: number): void {
    let addVideos: BsModalRef;
    addVideos = this._modalService.show(
      EditVideoComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        initialState: {
          videos: this.isVideosAddes ? this.createContentManDto.contentManagementVideos : this.createContentManDto.contentManagementVideos,
          id: id
        },
      }
    );
  
    addVideos.content.onSave.subscribe((res) => {
      if (res.length > 0) {
        this.isVideosAddes = true
      }
  
      this.createContentManDto.contentManagementVideos = res;
    
    });
  }
  getContentNotes() {
    this._contentService.getContentNotes(this.id).subscribe(res => {
      this.createContentManDto.contentManagementNotes = res;
    })
  }
  addNote(id?: number): void {
    let addNotes: BsModalRef;
    addNotes = this._modalService.show(
      EditNotesComponent,
      {
        class: 'modal-xl modal-dialog-centered',
        initialState: {
          id: id,
          notes: this.isNotesAddes ? this.createContentManDto.contentManagementNotes : this.createContentManDto.contentManagementNotes,
        },
      }
    );
    addNotes.content.onSave.subscribe((res) => {
      if (res.length > 0) {
        this.isNotesAddes = true
      }
      this.createContentManDto.contentManagementNotes = res;
    });
  }
}
