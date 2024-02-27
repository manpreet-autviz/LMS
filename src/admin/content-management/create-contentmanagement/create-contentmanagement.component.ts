import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { CategoryAppServicesServiceProxy, ContentManagementDto, ContentManagementNotesDto, ContentManagementServiceServiceProxy, ContentManagementVideosDto, CourseManagementAppServicesServiceProxy, CreateContentManagementDto, MockTestServiceProxy, QuestionServiceProxy, SubjectServiceServiceProxy, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { cloneDeep } from 'lodash-es';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddNotesComponent } from './add-notes/add-notes.component';
import { AddVideosComponent } from './add-videos/add-videos.component';

@Component({
  selector: 'app-create-contentmanagement',
  templateUrl: './create-contentmanagement.component.html',
  styleUrls: ['./create-contentmanagement.component.scss']
})
export class CreateContentmanagementComponent extends AppComponentBase implements OnInit,OnDestroy {
  loading = false;
  allSubjectItems: any = [];
  allCourses: any = [];
  allTopics: any = [];
  allCategories: any = [];
  selectedTopics: [] = [];
  selectedSubjects: [] = [];
  selectedMockTests: any = [];
  dropdownSettings;
  dropdownSetting;
  isNotesAddes: boolean;
  isVideosAddes: boolean
  videos: any[];
  notes: any[];
  fileName: any = "";
  treeData: any;
  selectedNode: any
  selectedCategory: any
  questions: any = [];
  isCollapse = true;
  allMockTests: any;
  courseType: any;
  price:any;
  createContentManDto: CreateContentManagementDto = new CreateContentManagementDto();
  contentMang: ContentManagementDto = new ContentManagementDto();
  @Output() onSave = new EventEmitter<any>();

  constructor(injector: Injector, private commonService: CommonService, private _modalService: BsModalService,
    private _questionService: QuestionServiceProxy, public router: Router, private _topicService: TopicsServiceProxy,
    private _subService: SubjectServiceServiceProxy, private _courseService: CourseManagementAppServicesServiceProxy,
    private _contentService: ContentManagementServiceServiceProxy, private _categoryService: CategoryAppServicesServiceProxy,
    private _apiService: AppSessionService,
    private _mockTestService: MockTestServiceProxy) { super(injector) }
  ngOnDestroy(): void {
    localStorage.removeItem('coursePrice')
  }

  ngOnInit(): void {
    this.contentMang.courseManagementId = 0;
    this.contentMang.categoryId = 0;
    this.getAllSubItems();
    this.getAllCategories();
    this.add();
    this.addMultiNotes();
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
    this.getAllTopics();
  }
  onUnSelectAll() {
    this.selectedSubjects = [];
    this.selectedTopics = [];
    this.selectedSubjects = []
    this.allTopics = [];
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
          let selectedFilterTopics: any = this.selectedTopics?.filter((q: any) => this.allTopics.map(w => w.id).includes(q.id));
          this.selectedTopics = cloneDeep(selectedFilterTopics)
        })
    }

  }

  getAllCourses() {
    this._courseService.getAllCoursesBasedOnCategory(this.contentMang.categoryId).subscribe(res => {
      this.allCourses = res;
   
      this.allMockTests = null;
      this.selectedMockTests = null;
    })
  }

  getAllMockTestsBasedOnCourse() {
    this._mockTestService.getAllMockTestBasedOnCourse(this.contentMang.courseManagementId).subscribe(res => {
      this.allMockTests = res;
      this.selectedMockTests = null;
      this.getSelectedCourseDetail(this.contentMang.courseManagementId);

    })
  }

  getSelectedCourseDetail(id: any) {
    this._courseService.get(id).subscribe(res => {
      this.courseType = res.type;
      this.price = res.price;
      localStorage.setItem('coursePrice', JSON.stringify(this.price))
    })
  }

  onFileUpload(file) {
    this.loading = true;
    if (file) {
      file = {
        fileName: file[0].name,
        data: file[0]
      };
      this.fileName = file.fileName;

      this._questionService.previewQuestion(file).subscribe(res => {
        this.questions = res;
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
    }
  }
  accordionCollapse() {
    this.isCollapse = !this.isCollapse;
  }
  save() {
  
    if (this.selectedCategory == undefined || this.contentMang.courseManagementId == 0) {
      this.notify.info("Please Fill The Required Field")
    }
    else if ((this.createContentManDto.contentManagementVideos[0].videoUrl == "" && this.courseType != "Mock")) {
      this.notify.info("Please Add the Content Videos")
    }
    else if (((this.selectedMockTests == null || this.selectedMockTests.length <= 0 ) && (this.courseType == "Mock" || this.courseType == "Hybrid"))) {
      this.notify.info("Please Add the Content Mocktests")
    }
    else {
      this._apiService.loading.next(true);
      //  this._questionService.createQuestions(this.questions).subscribe(res => {
      // this.createContentManDto.questionId = res
      this.createContentManDto.contentManagement = this.contentMang;
      this.createContentManDto.topicsId = this.selectedTopics.map((a: any) => a.id)
      this.createContentManDto.subjectId = this.selectedSubjects.map((a: any) => a.id)
      this.createContentManDto.mockTestId = this.selectedMockTests?.map((a: any) => a.id)
      this._contentService.createContentManagement(this.createContentManDto).subscribe(res => {
        this.notify.info(this.l('SavedSuccessfully'));
        this._apiService.loading.next(false);
        this.onSave.emit();
        localStorage.removeItem('coursePrice')
        this.router.navigate(['/app/contentmanagements']);
      })
      //  })
    }
  }
  add() {
    var contentManagementVideo = new ContentManagementVideosDto();
    contentManagementVideo.videoUrl = ''
    if (this.createContentManDto.contentManagementVideos == null) {
      this.createContentManDto.contentManagementVideos = [];
    }

    this.createContentManDto.contentManagementVideos.push(contentManagementVideo)
  }
  delVideo(index: number) {
    this.createContentManDto.contentManagementVideos.splice(index, 1)
  }
  cancel() {
    this.router.navigate(['/app/contentmanagements']);
  }
  addVideos(id?: number): void {
   
    let addVideos: BsModalRef;
    addVideos = this._modalService.show(
      AddVideosComponent,
      {
        class: 'modal-xl modal-dialog-centered',
        initialState: {
          videos: this.isVideosAddes ? this.createContentManDto.contentManagementVideos : null,
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
  addMultiNotes() {
   
    var contentManagementNotes = new ContentManagementNotesDto();
    contentManagementNotes.notesUrl = ''
    if (this.createContentManDto.contentManagementNotes == null) {
      this.createContentManDto.contentManagementNotes = [];
    }

    this.createContentManDto.contentManagementNotes.push(contentManagementNotes)
  }
  delNotes(index: number) {
    this.createContentManDto.contentManagementNotes.splice(index, 1)
  }

  addNote(id?: number): void {
    let addNotes: BsModalRef;
    addNotes = this._modalService.show(
      AddNotesComponent,
      {
        class: 'modal-xl modal-dialog-centered',
        initialState: {
          notes: this.isNotesAddes ? this.createContentManDto.contentManagementNotes : null,
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
    this.contentMang.categoryId = id.node.id;
    this.contentMang.courseManagementId = 0;
    this.getAllCourses();
  }
}

