import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { CourseManagementAppServicesServiceProxy, CreateTestSeriesDto, SubjectDto, SubjectServiceServiceProxy, TestSeriesDto, TestSeriesServiceServiceProxy, TopicsDto, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { cloneDeep } from 'lodash-es';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-testseries',
  templateUrl: './edit-testseries.component.html',
  styleUrls: ['./edit-testseries.component.scss']
})
export class EditTestseriesComponent extends AppComponentBase implements OnInit {
  test: TestSeriesDto = new TestSeriesDto();
  id: any;
  subject: SubjectDto = new SubjectDto();
  topics: TopicsDto = new TopicsDto();
  testSeries: CreateTestSeriesDto = new CreateTestSeriesDto();
  questions: any = [];
  allCourses: any = [];
  allSubjectItems: any = [];
  allTopics: any = [];
  selectedTopic: any = "";
  allTest: any = [];
  dropdownSettings;
  dropdownSetting;
  selectedSubjects: any = [];
  selectedTopics: [] = [];
  dates: any = [];
  isCollapse = true;

  @Output() onSave = new EventEmitter<any>();
  constructor(injector: Injector,private commonService:CommonService, private activeRouter: ActivatedRoute, private route: Router, private _testService: TestSeriesServiceServiceProxy, private _courseService: CourseManagementAppServicesServiceProxy, private _subjectService: SubjectServiceServiceProxy, private _topicService: TopicsServiceProxy, private _apiService: AppSessionService) { super(injector) }

  ngOnInit(): void {
    var navContent = { title: "Test Series", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
    this.activeRouter.params.subscribe(params => {
      this.id = params.id;
    });
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
    this.getTopics(this.test.subjectId);
    this.getAllCourses();
    this.getAllTests();
    this.getAllSubItems();
    this.getAllTopics();
    this.getAllSubjects();
    this.getTestQuestions();
   
  }

  getTestQuestions() {
    this._testService.getTestSeriesQuestions(this.id).subscribe(res => {
      this.questions = res;
    })
  }

  accordionCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  onItemDeSelect() {
    if (Boolean(this.selectedSubjects.map((a: any) => a.id))) {
      this._topicService.getTopicsBasedOnSubject(this.selectedSubjects.map((a: any) => a.id)).subscribe(
        res => {
          this.allTopics = res;
          let selectedFilteredTopics: any = this.selectedTopics.filter((q: any) => this.allTopics.map(w => w.id).includes(q.id));
          this.selectedTopics = cloneDeep(selectedFilteredTopics)
        })
    }
  }

  onSelectAll() {
    this._topicService.getAll('', 0, 100).subscribe(res => {
      this.allTopics = res.items;
    })
  }


  onUnSelectAll() {
    this.selectedSubjects = [];
    this.selectedTopics = [];
    this.allTopics = [];
  }
  onSelectItem(){
    if (Boolean(this.selectedSubjects.map((a: any) => a.id))) {
      this._topicService.getTopicsBasedOnSubject(this.selectedSubjects.map((a: any) => a.id)).subscribe(
        res => {
          this.allTopics = res;
  })
}}
  getAllCourses() {
    this._courseService.getAll("", 0, 1000).subscribe(
      res => {
        this.allCourses = res.items;
      })
  }

  getAllSubItems() {
    this._subjectService.getAll('', 0, 100).subscribe(res => {
      this.allSubjectItems = res.items;
    })
  }


  getAllSubjects() {
    this.selectedSubjects = [];

    this._subjectService.getAll("", 0, 100).subscribe(res => {

      this.allSubjectItems = res;

      if (Boolean(this.test.selectedSubjects?.length > 0)) {

        this.test.selectedSubjects.forEach((item: SubjectDto) => {

          var subject = { "id": item.id, "title": item.subjectName }

          this.selectedSubjects.push(subject)

        })

      }

      this.selectedSubjects = cloneDeep(this.selectedSubjects);

    })
  }

  getSelectedTopics() {
    this._testService.getTestSeriesTopics(this.id).subscribe((res: any) => {
      this.selectedTopics = res;
    })
  }

  getTopics(subjectId: any) {
    this._topicService.getTopicsBySubject(subjectId).subscribe(res => {
      this.allTopics = res;
    })
  }

  getAllTopics() {
    if (Boolean(this.selectedSubjects.map((a: any) => a.id))) {
      this._topicService.getTopicsBasedOnSubject(this.selectedSubjects.map((a: any) => a.id)).subscribe(
        res => {
          this.allTopics = res;
          this.getSelectedTopics();

        })
    }
  }


  getAllTests() {
    this._testService.get(this.id).subscribe(
      res => {
        this.test = res;
        this.dates = this.test.startDate.format("YYYY-MM-DD");
      })
    this._testService.getTestSeriesSubjects(this.id).subscribe(res => {
      this.selectedSubjects = res;
      this.getAllTopics();
    })
  }

  saveDate() {
    this.test.startDate = moment(this.dates).add("5", "hours").add("30", "minutes");
  }

  Date() {
    
  }

  save() {
    this._apiService.loading.next(true);
    this.saveDate();
    this.testSeries.testSeries = this.test;
    this.testSeries.topicsId = this.selectedTopics.map((a: any) => a.id)
    this.testSeries.subjectId = this.selectedSubjects.map((b: any) => b.id)
    this._testService.updateMultipleTestSeriesTopics(this.testSeries).subscribe(res => {
      this.notify.info(this.l('SavedSuccessfully'));
      this._apiService.loading.next(false);
      this.onSave.emit();
      this.route.navigate(['/app/testseries'])
    },(err)=>{
      this._apiService.loading.next(false);
    });
  }

  cancel() {
    this.route.navigate(['/app/testseries'])
  }
}