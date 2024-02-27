import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { CourseManagementAppServicesServiceProxy, CreateTestSeriesDto, QuestionDto, QuestionServiceProxy, SubjectDto, SubjectServiceServiceProxy, TestSeriesDto, TestSeriesQuestionServiceProxy, TestSeriesServiceServiceProxy, TopicsDto, TopicsServiceProxy, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { cloneDeep } from 'lodash-es';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-testseries',
  templateUrl: './create-testseries.component.html',
  styleUrls: ['./create-testseries.component.scss']
})
export class CreateTestseriesComponent extends AppComponentBase implements OnInit {
  test: TestSeriesDto = new TestSeriesDto();
   loading = false;
  subject: SubjectDto = new SubjectDto();
  topics: TopicsDto = new TopicsDto();
  testSeries: CreateTestSeriesDto = new CreateTestSeriesDto();
  question: QuestionDto = new QuestionDto();
  allCourses: any = [];
  allSubject: any = [];
  allTopics: any = [];
  selectedSubject: any = "";
  dropdownSettings;
  dropdownSetting;
  selectedTopics: [] = [];
  fileName: any = "";
  isCollapse = true
  questions: any = [];


  testSeriesQues: any = [];
  @Output() onSave = new EventEmitter<any>();
  constructor(injector: Injector, private commonService:CommonService,public route: Router, private _testService: TestSeriesServiceServiceProxy, private _questionService: QuestionServiceProxy, private _courseService: CourseManagementAppServicesServiceProxy, private _subjectService: SubjectServiceServiceProxy, private _topicService: TopicsServiceProxy, private _apiService: AppSessionService) { super(injector) }

  ngOnInit(): void {
    var navContent = { title: "Test Series", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
    this.test.courseManagementId = -1;
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
    this.getAllCourses();
    this.getAllSubjects();
    this.getAllTopics();
  
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
 this.selectedSubject=[];
 this.selectedTopics=[];
this.allTopics = []
}

  getAllCourses() {
    this._courseService.getAll("", 0, 1000).subscribe(
      res => {
        this.allCourses = res.items;
      })
  }

  getAllSubjects() {
    this._subjectService.getAll("", 0, 1000).subscribe(
      res => {
        this.allSubject = res.items;
      })
  }

  getAllTopics() {
    if (Boolean(this.selectedSubject.map((a: any) => a.id))) {
      this._topicService.getTopicsBasedOnSubject(this.selectedSubject.map((a: any) => a.id)).subscribe(
        res => {
          this.allTopics = res;
          let selectedFilteredTopics:any = this.selectedTopics.filter((q:any)=>this.allTopics.map(w=>w.id).includes(q.id));
          this.selectedTopics= cloneDeep(selectedFilteredTopics)
        })
    }
  }


  saveDate() {
    this.test.startDate = moment(this.test.startDate).add("5", "hours").add("30", "minutes");
  }
  accordionCollapse() {
    this.isCollapse = !this.isCollapse;
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

      this.questions = res
      this.loading = false;
      })
    }
  }

  save() {
    if(this.test.courseManagementId == -1 || this.selectedSubject.length == 0 || this.selectedTopics.length == 0 || this.test.startDate == null || this.test.durationTime == null || this.test.fileName == null)
    {
      this.notify.info("Please select required fields.")
    }
    else{
    this.saveDate();
    if (this.checkValidationCourse()) {
      this._apiService.loading.next(true);
      this._questionService.createQuestions(this.questions).subscribe(res => {

        // this.testSeries.questionId = res

        this.testSeries.testSeries = this.test;

        this.testSeries.topicsId = this.selectedTopics.map((a: any) => a.id)
        this.testSeries.subjectId = this.selectedSubject.map((b: any) => b.id)

        this._testService.createTestSeries(this.testSeries).subscribe(res => {
          this._apiService.loading.next(false);
          this.notify.info(this.l('SavedSuccessfully'));

          this.onSave.emit();

          this.route.navigate(['app/testseries'])

        })

      })

    }

  }
}


  checkValidationCourse() {
    var isInvalid = false
    if (this.test.courseManagementId == -1 ) {
      this.notify.info("Please Select Course")
      isInvalid = true
    }
    if (isInvalid) {
      return false;
    }
    else {
      return true;
    }
  }


  cancel() {
    this.route.navigate(['/app/testseries'])
  }
}




