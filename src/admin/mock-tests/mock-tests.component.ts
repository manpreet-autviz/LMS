import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseManagementAppServicesServiceProxy, MockTestDto, MockTestDtoServerSidePaginationOutput, MockTestPaginationInput, MockTestServiceProxy, SearchType, ServerSidePaginationInput, Sorting, SubjectServiceServiceProxy, TopicsDto, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateMocktestComponent } from './create-mocktest/create-mocktest.component';
import { EditMocktestComponent } from './edit-mocktest/edit-mocktest.component';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { cloneDeep } from 'lodash-es';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { CommonService } from '@shared/helpers/common.service';
import { DtOption } from '@shared/session/app-session.service';

@Component({
  selector: 'app-mock-tests',
  templateUrl: './mock-tests.component.html',
  styleUrls: ['./mock-tests.component.scss']
})
export class MockTestsComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  allMockTest: any = [];
  loading = false;
  title = 'datatables';
mockTestPaginationDto: MockTestPaginationInput = new MockTestPaginationInput();
serverInput: ServerSidePaginationInput = new ServerSidePaginationInput();
  dtOptions: DataTables.Settings = new DtOption().dtOptions;
  columns: any = [

    { data: "title" },
    { data: "courseName" },
    { data: "fileName" },
    { data: "subjectName" },  
    { data: "duration" },   
    { data: "sectionDuration" },      
  ];

  totalData : any = [];
  filterMocktest:any=[]
  multipleModels: any = {};
  allSubjectItems: any = [];
  allTopics: any = [];
  allCourses: any = [];
  selectedTopics: [] = [];
  selectedSubjects: [] = [];
  filterSubjectIds = [];
  filterTopicIds = []
  dropdownSettingsTopic;
  dropdownSettingSubject;
filterObject = { filterSubjectIds: null, filterTopicIds:null};
  dtTrigger: Subject<any> = new Subject<any>();
  mockTest: MockTestDto = new MockTestDto();
  selectedItem: [] =[];
  constructor(injector: Injector,private commonService:CommonService, private _mockTestServic: MockTestServiceProxy, private router: Router
  , private _subService: SubjectServiceServiceProxy) { super(injector) }

  ngOnInit(): void {
    this.getAllSubItems();
   this.getAllMockTest()
    this.dropdownSettingSubject = {
      singleSelection: false,
      idField: 'id',
      textField: 'subjectName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
  }

  onSelectAll(items:any) {
    this.filterSubjectIds=items.map((a:any)=>a.id);
    this.mockTestPaginationDto.subjectsIds = this.filterSubjectIds
        this.renderer();
        this.getAllMockTest();
}

onItemDeSelect() {  
    this.getsubject()
}

onUnSelectAll() {
  this.selectedItem=[],
  this.selectedSubjects=[],
  this.selectedTopics = []
 this.allTopics=[];
 this.mockTestPaginationDto.subjectsIds  = null;
 this.renderer();
 this.getAllMockTest();
 
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
      })
    }
  }
  reRenderDtOption(skip) {
    this.dtElement.dtOptions.displayStart = skip;

  }

  getAllMockTest() {
    this.dtOptions.pagingType = "simple_numbers";
    this.dtOptions.serverSide = true;
    this.dtOptions.processing = false;
    this.dtOptions.searching = true;
    this.dtOptions.ajax = (dataTablesParameters: any, callback) => {
      var offset = dataTablesParameters ? dataTablesParameters.start : 0;
      var limit = dataTablesParameters ? dataTablesParameters.length : 10;
      var searchvalues = dataTablesParameters ? dataTablesParameters.search.value : ""
      this.serverInput.search = new SearchType()
      this.serverInput.sorting = new Sorting()
      this.serverInput.search.type = "";
      this.serverInput.search.value = searchvalues;
      this.serverInput.take = limit
      this.serverInput.skipCount =offset;
    
      if (dataTablesParameters.order.length > 0) {
       this.serverInput.sorting.propertyName = this.columns[dataTablesParameters.order[0].column].data.toString();
       this.serverInput.sorting.format = dataTablesParameters.order[0].dir.toString();
      }
      else {
          this.serverInput.sorting.propertyName = "id";
          this.serverInput.sorting.format = "desc";
        }
        
        this.loading = true;
        this.mockTestPaginationDto.serverSidePaginationInput = this.serverInput;
        this._mockTestServic.getAllMockTestSQL(this.mockTestPaginationDto).subscribe(res => {
     
        this.allMockTest = res.data;
        this.totalData = res.totalCount;
        this.filterMocktest = res.data
        this.loading = false;
        callback({
          recordsTotal: res.totalCount,
          recordsFiltered: res.filterCount,
          data: [],
        });
  
        var navContent = { title: "MockTest", lengthh: this.totalData }
        this.commonService.pageTitle.next(navContent)
       

      },(err)=>{
        this.loading=false;
      });
    }

    this.dtOptions.columns = this.columns;
    this.dtOptions.order = [];
  }
  getAllSubItems() {
   this._subService.getAll('', 0, 100).subscribe(res => {
   this.allSubjectItems = res.items;
     
    })
  }



  getsubject() {
    if (Boolean(this.selectedItem.map((a: any) => a.id))) {
    this.filterSubjectIds=this.selectedItem.map((a:any)=>a.id);
    this.mockTestPaginationDto.subjectsIds = this.filterSubjectIds
    this.renderer();
     this.getAllMockTest()
    }}
  
    setSubject() {
    if (Boolean(this.selectedSubjects)) {
      this.filterSubjectIds = this.selectedSubjects.map((a: any) => a.id)
    }
  }



  showCreateOrEditDialog(id?: number): void {
    if (!id) {
      this.router.navigate(['app/create-mocktests'])
    } else {
      this.router.navigate(['app/edit-mocktests/' + id])
    }

  }
  delMockTest(mocktest: any) {
    abp.message.confirm(
      this.l("This mocktest will be deleted....!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._mockTestServic.delete(mocktest.id).subscribe(res => {
            this.notify.success("Deleted SuccessFully");
            this.renderer();
            this.getAllMockTest();
          });
        }
      }
    );
  }
}


