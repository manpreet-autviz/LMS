import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { CategoryAppServicesServiceProxy, CategoryDto, ContentManagementDto, ContentManagementDtoServerSidePaginationOutput, ContentManagementServiceServiceProxy, ContentServerSidePagination, CourseManagementAppServicesServiceProxy, SearchType, ServerSidePaginationInput, Sorting, SubjectServiceServiceProxy, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { DataTableDirective } from 'angular-datatables';
import { cloneDeep } from 'lodash-es';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CreateContentmanagementComponent } from './create-contentmanagement/create-contentmanagement.component';
import { EditContentmanagementComponent } from './edit-contentmanagement/edit-contentmanagement.component';
import { DtOption } from '@shared/session/app-session.service';

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.scss']
})
export class ContentManagementComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
  allSubjects: any = [];
  allCourses: any[] = [];
  allTopics: any[];
  allCategories: any[];
  filterSubjectIds = [];
  filterTopicIds = []
  totalContent: any = [];
  allContentMangement: any = [];
  columns: any = [
    { data: "categoryName" },
    { data: "coursName" },
    { data: "subjectName" },
    { data: "topicsName" },

  ]
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  title = 'datatables';
  dtOptions: DataTables.Settings = new DtOption().dtOptions;
  // dtOptions: DataTables.Settings = {
  //   pagingType: 'simple_numbers',
  //   pageLength: 10,
  //   lengthMenu: [[10, 50, 100, 200, 500, -1], [10, 50, 100, 200, 500, "All"]],
  //   order: [],
  // };
  dtTrigger: Subject<any> = new Subject<any>();
  selectedTopics: any[];
  selectedSubjects: any[];
  selectedSubject: any = "";
  selectedItems: [] = [];
  allContent: any = [];
  courseId = 0;
  categoryId: any;
  dropdownSettings;
  dropdownSetting;
  treeData: any;
  loading = false;
  selectedNode: any
  contentMang: ContentManagementDto = new ContentManagementDto();
  contentServersidePagination: ContentServerSidePagination = new ContentServerSidePagination();
  input: ServerSidePaginationInput = new ServerSidePaginationInput();
  constructor(injector: Injector, private commonService: CommonService, private _contentManagement: ContentManagementServiceServiceProxy, private router: Router, private _topicService: TopicsServiceProxy, private _subService: SubjectServiceServiceProxy, private _courseService: CourseManagementAppServicesServiceProxy, private _contentService: ContentManagementServiceServiceProxy, private _categoryService: CategoryAppServicesServiceProxy) { super(injector) }
  ngOnInit(): void {
    this.getAllComtentMang();
    this.getAllSubItems();
    // this.getAllTopics();
    this.getAllCategories();
    this.contentMang.categoryId = 0;
    this.contentMang.courseManagementId = 0;

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
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  renderer(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        let defDtOption = new DtOption().dtOptions;
        this.reRenderDtOption(defDtOption.displayStart);
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  }
  reRenderDtOption(skip) {
    this.dtElement.dtOptions.displayStart = skip;
  }
  getAllCategories() {
    this._categoryService.getAll("", 0, 100).subscribe(res => {
      this.allCategories = res.items;
      this.getParentChildData();
    })
  }
  getAllCourses() {

    this._courseService.getAllCoursesBasedOnCategory(this.categoryId).subscribe(res => {
      this.allCourses = res;
    })
  }
  getAllSubItems() {
    this._subService.getAll('', 0, 100).subscribe(res => {
      this.allSubjects = res.items;
    })
  }
  onSelectAll(items:any) {
      this.filterSubjectIds = items.map((a: any) => a.id);
      this.contentServersidePagination.subjectsIds = this.filterSubjectIds;
      this.renderer();
      this.getAllComtentMang();
  }
  onSelectAllTopics() {
this.filterTopicIds = this.selectedTopics.map((a: any) => a.id)
this.contentServersidePagination.subjectsIds = this.filterSubjectIds;
this.renderer();
this.getAllComtentMang();
      
  }
  onDeSelectItem() {
    this.getAllTopics();
  }
  onDeSelectTopic() {
    this.filterTopicIds = this.selectedTopics.map((a: any) => a.id)
    this.renderer();
    this.getAllComtentMang();
  }
  onUnSelectAll() {
    this.selectedItems = [];
    this.selectedSubjects = []
    this.contentServersidePagination.subjectsIds = null;
    this.renderer();
    this.getAllComtentMang();
  }
  selectCourse(id:any){    
this.contentServersidePagination.courseId = id;
this.renderer();
this.getAllComtentMang();
  }
  getAllTopics() {
    if (Boolean(this.selectedItems.map((a: any) => a.id))) {
    
      this.filterSubjectIds = this.selectedItems.map((a: any) => a.id);
  this.contentServersidePagination.subjectsIds = this.filterSubjectIds;
  this.renderer();
      this.getAllComtentMang();
    }
  }
  getAllComtentMang() {
    this.dtOptions.pagingType = "simple_numbers";
    this.dtOptions.serverSide = true;
    this.dtOptions.processing = false;
    this.dtOptions.search = true;
    this.dtOptions.ajax = (dataTablesParameters: any, callback) => {
      var offset = dataTablesParameters ? dataTablesParameters.start : 0;
      var limit = dataTablesParameters ? dataTablesParameters.length : 10;
      var searchvalues = dataTablesParameters ? dataTablesParameters.search.value : ""
      this.input.search = new SearchType();
      this.input.sorting = new Sorting()
      this.input.search.type = "";
      this.input.search.value = searchvalues;
      this.input.take = limit;
      this.input.skipCount = offset;
      if (dataTablesParameters.order.length > 0) {
        this.input.sorting.propertyName = this.columns[dataTablesParameters.order[0].column].data.toString();
        this.input.sorting.format = dataTablesParameters.order[0].dir.toString();
      } else {
        this.input.sorting.propertyName = "id";
        this.input.sorting.format = "desc"
      }
      this.loading = true;
      this.contentServersidePagination.serverSidePaginationInput = this.input;
      this.contentServersidePagination.courseId = this.courseId;
      this._contentManagement.getALLContents(this.contentServersidePagination).subscribe(
        res => {
          this.allContent = res.data;
          this.totalContent = res.totalCount;
          var navContent = { title: "Content Management", lengthh: this.totalContent }
          this.commonService.pageTitle.next(navContent)
          this.loading = false;
          callback({
            recordsTotal: res.totalCount,
            recordsFiltered: res.filterCount,
            data: [],
          });

        },(err)=>{
          this.loading=false;
        });
    }
    this.dtOptions.columns = this.columns;
    this.dtOptions.order = [];
  }
  setSubject() {
    if (Boolean(this.selectedSubject)) {
      this.filterSubjectIds = this.selectedSubject.map((a: any) => a.id)
      //this.getAllTopics();
    }
  }
  setTopic() {
    if (Boolean(this.selectedTopics)) {
      this.filterTopicIds = this.selectedTopics.map((a: any) => a.id)
      this.renderer();
      this.getAllComtentMang();
    }
  }
  getCategory(id: any) {
    this.categoryId = id;
    this.courseId = 0;
    this.getAllCourses();
    this.contentServersidePagination.categoryId = id;
    this.renderer();
    this.getAllComtentMang();

  }

  showCreateOrEditDialog(id?: number): void {
    if (!id) {
      this.loading = true;
      this.router.navigate(['/app/create-contentmanagements']);
      this.loading = false;
    } else {
      this.loading = true;
      this.router.navigate(['/app/edit-contentmanagements/' + id]);
      this.loading = false;
    }


  }
  delContentMang(content: any) {
    abp.message.confirm(
      this.l("This content will be deleted....!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._contentManagement.deleteContent(content.id).subscribe(res => {
            this.notify.success("Deleted SuccessFully");
            this.renderer();
            this.getAllComtentMang();

          });
        }
      }
    );
  }

  getParentChildData() {

    var selectAllCategory = new CategoryDto();
    selectAllCategory.id = 0,
      selectAllCategory.categoryName = "All Category";
    this.allCategories.unshift(selectAllCategory);
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
  resetFilter() {
    this.categoryId = 0;
    this.selectedNode = 0;
    this.courseId = 0;
    this.selectedItems = [];
    this.selectedTopics = [];
    this.allTopics = [];
    this.filterSubjectIds = [];
    this.filterTopicIds = [];
    this.renderer();
    this.getAllComtentMang();
  }
}
