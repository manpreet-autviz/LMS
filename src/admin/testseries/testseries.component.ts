import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SubjectServiceServiceProxy, TestSeriesDto, TestSeriesServiceServiceProxy, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateTestseriesComponent } from './create-testseries/create-testseries.component';
import { EditTestseriesComponent } from './edit-testseries/edit-testseries.component';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { CommonService } from '@shared/helpers/common.service';

@Component({
  selector: 'app-testseries',
  templateUrl: './testseries.component.html',
  styleUrls: ['./testseries.component.scss']
})
export class TestseriesComponent extends AppComponentBase implements OnInit,AfterViewInit,OnDestroy {
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
  allTest : any=[];
  allSubjects : any[];
  allTopics : any[];
  test: TestSeriesDto = new TestSeriesDto();
  selectedSubject: any = "";
  dropdownSettings;
  dropdownSetting;
  selectedTopics: [] = [];
  allSubject: any = [];
 filterSubjectIds=[];
  filterTopicIds=[]
selectedItem :any =[];
loading = false;

  constructor(injector: Injector , private _testService: TestSeriesServiceServiceProxy,
   private route: Router, private commonService:CommonService,private _subjectService:SubjectServiceServiceProxy, private _topicService:TopicsServiceProxy, private http: HttpClient)
    { super(injector)}

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
  this.dropdownSetting = {
    singleSelection: false,
    idField: 'id',
    textField: 'subjectName',
    selectAllText: 'Select All ',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
    this.getAllSubjects();
    this.getAllTopics();
    this.getAllTests();
  }

  onItemDeSelect() {
    this.getAllTopics();
   }
   
onSelectAll(){
 this._topicService.getAll('',0,100).subscribe(res=>{
   this.allTopics = res.items;
 })
}

onUnSelectAll() {
 this.selectedItem=[];
 this.filterSubjectIds=[];
 this.selectedTopics=[];
 this.filterTopicIds=[];
this.allTopics=[]
}

resetFilter(){
 this.selectedItem=[];
 this.filterSubjectIds=[];
 this.selectedTopics=[];
 this.filterTopicIds=[];
 this.allTopics = []
 this.getAllTests();
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

 getAllTests(){
  this.loading = true;
  if(Boolean(this.selectedSubject)){

    this.filterSubjectIds = this.selectedSubject.map((a:any)=>a.id)
  }
  
  if(Boolean(this.selectedTopics)){
  
    this.filterTopicIds = this.selectedTopics.map((a:any)=>a.id)
  
  }
  this._testService.getAllTestSeriesFilter(this.filterSubjectIds,this.filterTopicIds).subscribe(
    res=>{this.allTest=res;
      var navContent = { title: "Test Series Management", lengthh: this.allTest.length }
      this.commonService.pageTitle.next(navContent)
      this.loading = false;
      this.renderer();
    },(err)=>{
      this.loading=false;
    });
  }

  getAllSubjects(){
    this.loading = true;
    this._subjectService.getAll('',0,100).subscribe(res=>{
      this.allSubjects = res.items;
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  
  getAllTopics(){
    this.loading = true;
    // this.filterTopicIds=[];
    // this.selectedTopics = [];
    if (Boolean(this.selectedItem.map((a: any) => a.id))){
    this._topicService.getTopicsBasedOnSubject(this.selectedItem.map((a: any) => a.id)).subscribe(res=>{
      this.allTopics = res;
      this.loading = false;
      let selectedFilterTopics:any = this.selectedTopics.filter((q:any)=> this.allTopics.map(w=>w.id).includes(q.id));
      this.selectedTopics = cloneDeep(selectedFilterTopics)
    },(err)=>{
      this.loading=false;
    });
    }
    this.filterSubjectIds=this.selectedItem.map((a:any)=>a.id);
  }
  
  setSubject(){
    if(Boolean(this.selectedSubject)){
    this.filterSubjectIds = this.selectedSubject.map((a:any)=>a.id)
    }
  }

  setTopic(){
    if(Boolean(this.selectedTopics)){
      this.filterTopicIds = this.selectedTopics.map((a:any)=>a.id)
    }
  }


showCreateOrEditDialog(id?: number): void {
    
    if (!id) {
      this.route.navigate(['/app/create-testseries'])
    } 
    else {
      this.route.navigate(['/app/edit-testseries/'+id])
    }
}

  delTest(test: any) {
    abp.message.confirm(
      this.l("This test Series will be deleted...!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._testService.delete(test.id).subscribe(res => {
            this.notify.success("This data will be deleted....");
            this.getAllTests();           
          });
        }
      }
    );
  }
  
}