import { Component, EventEmitter, Injector, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { CommonServiceServiceProxy, CourseManagementAppServicesServiceProxy, CourseManagementDto, CreateMockTestDto, MockTestAppServicesServiceProxy, MockTestDto, MockTestQuestionDto, MockTestServiceProxy, QuestionDto, QuestionServiceProxy, SubjectDto, SubjectServiceServiceProxy, Topics, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { cloneDeep, forEach, iteratee } from 'lodash-es';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { time } from 'console';

@Component({
  selector: 'app-create-mocktest',
  templateUrl: './create-mocktest.component.html',
  styleUrls: ['./create-mocktest.component.scss']
})
export class CreateMocktestComponent extends AppComponentBase implements OnInit, OnDestroy {
  next: any;
  iterator: any;
  loading = false;
  disabled=false
  mockTest: MockTestDto = new MockTestDto();
  mockTestQues: any = [];
  question: QuestionDto = new QuestionDto();
  editquestion: QuestionDto = new QuestionDto();
  createmockTestDto: CreateMockTestDto = new CreateMockTestDto();
  allCourses: any = [];
  selectedTopics: [] = [];
  selectedSubjects: [] = [];
  dropdownSettings;
  dropdownSetting;
  allTopics: any = [];
  allSubjectItems: any = [];
  subjects: SubjectDto[];
  topics = {};
  fileName: any
  questions: any[] = [];
  mocktests: any = [];
  @Output() onSave = new EventEmitter<any>();
  isCollapse = true
  bindData: any[] = [];
  isSectionBased: boolean;
  isQuestionAdded: boolean = false;
  addQuestions: any = [];
  duplicateFile: boolean = false;
  isImageUpladedStatus: boolean;
  showFile: string;
  sectionSubject: any = [];
  previewedQuestion: any;
  questionIndex: any;
  checkSection: boolean = true;
  invalidQuestionIndex: any = [];
  inavlidQuesData: boolean = false;
  course: CourseManagementDto = new CourseManagementDto();
  timeoutId: NodeJS.Timeout;
  direction: string;
  sum: any = 0;
  disableLoadingButton: boolean = false;
  isQuestionLoading: boolean
  nextQuestion :boolean=false;
  options5: any
  constructor(private _modalService: BsModalService,
    injector: Injector, private _commonService: CommonServiceServiceProxy, public router: Router,
    private commonService: CommonService,
    private _mocktestService: MockTestServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _topicService: TopicsServiceProxy,
    private _subService: SubjectServiceServiceProxy,
    private questionService: QuestionServiceProxy,
    private _apiService: AppSessionService,) { super(injector) }
  ngOnDestroy(): void {
    localStorage.removeItem('isSectionBasedMock');
    this.questions = []
    this.commonService.addQuestions = []
    this.commonService.questions = []
  }

  ngOnInit(): void {
    this.iterator = function (a, n) {
        var current = 0,
        l = a.length;
      return function () {
        if(this.nextQuestion==true){
          this.nextQuestion=false;
           a = this.bindData
          var end = current + n;
          var part = a.slice(current, end);
          current = end < l ? end : 0;
          return part;
        }else{
          var end = current + n;
          var part = a.slice(current, end);
          current = end < l ? end : 0;
          return part;
        }
       
      };
    };
    localStorage.setItem('isSectionBasedMock', 'true');
    if (this.commonService.createMockTest.mockTests != undefined) {

      this.mockTest = cloneDeep(this.commonService.createMockTest.mockTests);
      this.createmockTestDto.mockTestSection = cloneDeep(this.commonService.createMockTest.mockTestSection);
      this.questions = cloneDeep(this.commonService.questions);
      this.previewSelectedQuestions();

    }
    else {
      this.mockTest.courseManagementId = -1;
    }
    this.getAllCourses();
    this.getAllTopics();
    this.getAllSubItems();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      enableCheckAll: true,
    };
    this.dropdownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'subjectName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      enableCheckAll: true,
    };
    var navContent = { title: "MockTest Management", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
    this.mockTest.eachQuestionNumber = 1;
  }
  isSectionBasedTime() {
    localStorage.setItem('isSectionBasedMock', 'false')
    this.isSectionBased = !this.isSectionBased;
    if (this.isSectionBased == false) {
      this.mockTest.duration = null;
      localStorage.setItem('isSectionBasedMock', 'true')
    }
  }
  onSelectAll() {
    this._topicService.getAll('', 0, 1000).subscribe(
      res => {
        this.allTopics = res.items;
      })
  }
  onItemDeSelect() {
    this.getAllTopics()
  }

  onUnSelectAll() {
    this.selectedSubjects = [],
      this.selectedTopics = []
    this.allTopics = [];
  }
  getAllTopics() {
    if (Boolean(this.selectedSubjects.map((a: any) => a.id))) {
      this._topicService.getTopicsBasedOnSubject(this.selectedSubjects.map((a: any) => a.id)).subscribe(
        res => {
          this.allTopics = res;
          let selectedFilterTopics: any = this.selectedTopics.filter((q: any) => this.allTopics.map(w => w.id).includes(q.id));
          this.selectedTopics = cloneDeep(selectedFilterTopics)
        })
    }
  }
  getAllCourses() {
    this._courseService.getAllDataBasedOnCategory(-1, 'HybridMock').subscribe(res => {
      this.allCourses = res;
    })
  }
  getAllSubItems() {
    this._subService.getAll('', 0, 100).subscribe(res => {
      this.allSubjectItems = res.items;
      // this.getSectionSubjects();
    })
  }
  getAllQuestion() {
    this.questionService.getAllQuestionFileName
  }

  accordingCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  set() {
    this.checkSection = this.checkSection == true ? false : true;
  }

  editPreviewedQuestion(index) {

    this.questionIndex = index;
    this.set();
    //this.previewedQuestion = cloneDeep(this.questions[index]);
    this.previewedQuestion = cloneDeep(this.bindData[index]);

  }
  cancelEditQuestion(index) {
    this.questionIndex = index;
    this.set();
    //  this.previewedQuestion = this.questions[index];
    this.previewedQuestion = this.bindData[index];
  }
  saveQuestion() {
    if (this.previewedQuestion.questions == null || this.previewedQuestion.questions == '' || this.previewedQuestion.option1 == null || this.previewedQuestion.option1 == '' || this.previewedQuestion.option2 == null || this.previewedQuestion.option2 == ''
      || this.previewedQuestion.option3 == null || this.previewedQuestion.option3 == '' || this.previewedQuestion.option4 == null || 
      this.previewedQuestion.option4 == '' || this.previewedQuestion.answer == null ||
       this.previewedQuestion.answer == '' || this.previewedQuestion.explanations == null || 
       this.previewedQuestion.explanations == ''|| this.previewedQuestion.option5 =='') {
      this.notify.success("please fill required fields");
    }
    else {
      this.bindData[this.questionIndex] = this.previewedQuestion;
      this.nextQuestion=true;
      if (this.questions[this.questionIndex] != null) {
        this.nextQuestion=false;
        this.questions[this.questionIndex] = this.previewedQuestion
      }
      this.set();
      this.invalidQuestionIndex = [];
      this.inavlidQuesData = false;
      this.checkInvalidQuestion();
      this.notify.success("update question");

    }


  }
  onFileUpload(file) {
    this.loading = true;
    if (file) {
      file = {
        fileName: file[0].name,
        data: file[0]
      };
      this.fileName = file.fileName;
      this.questionService.previewQuestion(file).subscribe(res => {
        if (this.questions.length > 0) {
          this.questions = this.questions.concat(res);
        } else {
          this.questions = res
        }
        this.loading = false;
      }, (err) => {
        this.loading = false;
      });
    }
  }

  onUpload(file) {
    if (file) {
      this.isImageUpladedStatus = true;
      file = {
        fileName: file[0].name,
        data: file[0]
      };
    }
    this._commonService.uploadImage(file).subscribe(res => {
      this.isImageUpladedStatus = false;
      this.mockTest.uploadFile = res.saveLink
      this.showFile = res.showLink

    })
  }
  changeCourse(id: any) {
    this._courseService.get(id).subscribe((res) => {
      this.course = res;
    })
  }
  save() {
    if (this.mockTest.title == null || this.mockTest.title == '' || this.mockTest.courseManagementId == -1
      || this.mockTest.uploadFile == '' || this.mockTest.uploadFile == null || this.questions.length == 0) {
      this.notify.info("Please fill the required fields.")
    }
    this.questionService.getQuestionByFileName(this.questions[0].fileName).subscribe(res => {
      if (res.fileName) {
        this.duplicateFile = true;
      }
      if (this.mockTest.title == null || this.mockTest.uploadFile == null) {
        this.notify.info("Please select required fields.")
      }
      else if (this.isSectionBased && (this.mockTest.duration <= 0 || this.mockTest.duration == undefined)) {
        this.notify.info(this.mockTest.duration <= 0 ? "Duration can't be 0 or nagitive.. !" : "Please fill the duration field.")
      }
     
      else if (this.mockTest.isNegativeMarking == true && this.mockTest.eachQuestionNegativeMarking <= 0) {
        this.notify.info(" EachQuestion Negative Marking can't  be 0 and less then 0.. !")
      }
      else if (this.mockTest.eachQuestionNumber <= 0) {
        this.notify.info(" EachQuestion Question Marks can't  be 0 and less then 0.. !")
      }
      else if (this.inavlidQuesData == true) {
        this.notify.error("Please Provide Valid Question")
      }
      else {

        if (this.checkValidationCourse()) {
          this.loading = true;
          this._apiService.loading.next(true);
          this.bindData.forEach(element => {
            element.courseManagementId = this.mockTest.courseManagementId;
          });
          this.questionService.createQuestions(this.bindData).subscribe(res => {
            this.createmockTestDto.questionIndex = res
            this.createmockTestDto.mockTests = this.mockTest;
            if (!this.isSectionBased) {
              this.createmockTestDto.mockTests.duration = 0;
            }
            this._mocktestService.createMockTests(this.createmockTestDto).subscribe(res => {
              this.notify.info(this.l('SavedSuccessfully'));
              localStorage.removeItem('isSectionBasedMock');
              this.commonService.createMockTest.mockTestSection = [];
              this.commonService.addQuestions = [];
              this.commonService.questions = [];
              this._apiService.loading.next(false);
              this.loading = false
              this.onSave.emit();
              this.router.navigate(['app/mocktests'])
            })
          },(err)=>{
            this.loading=false;
            this._apiService.loading.next(false);
          });
        }
      }
    })
  }

  checkValidationCourse() {
    var isInvalid = false
    if (this.mockTest.courseManagementId == -1) {
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
    this.router.navigate(['app/mocktests'])
    this.commonService.createMockTest.mockTestSection = [];
    this.commonService.addQuestions = [];
    this.commonService.questions = [];

  }
  openAddQuestion() {
    let addQuestion: BsModalRef;
    addQuestion = this._modalService.show(
      AddQuestionComponent,
      {
        // backdrop: 'static',
        keyboard: false,
        class: 'modal-lg  modal-dialog-centered',
        initialState: {
          quest: this.isQuestionAdded ? this.addQuestions : null,
        },
      }
    );

    addQuestion.content.onSave.subscribe((res: any) => {
      this.loading = true;  
      if (res.allQuestions.length > 0 || res.items.length > 0) {
        if (res.questions.length > 0) {
          this.isQuestionAdded = true;
          this.addQuestions = res.questions;
          this.commonService.addQuestions = cloneDeep(this.addQuestions);
        }
        this.createmockTestDto.mockTestSection = res.items;
        this.sectionSubject = [];
        this.getSectionSubjects();
        this.bindData = res.allQuestions.flat();
        this.checkInvalidQuestion();
        if (res.allQuestions.flat().length > 10) {
          this.lazyLoader(res.allQuestions.flat())
         
        }
        else {
          this.questions = res.allQuestions.flat();
          this.commonService.questions = cloneDeep(this.questions);
          this.isQuestionLoading = true;
          this.loading=false;
        }


      }

    },(err)=>{
      this.loading=false;
    });
  }
  onScrollDown() {
    this.direction = "down";
    var part = this.next();
    this.questions = this.questions.concat(part);
    setTimeout(() => {
      this.isQuestionLoading = false;
    },4000)

  }




  lazyLoader(questions) {
    
    this.sum = questions.length;
    this.next = this.iterator(questions, 10);
    this.loading=false
    this.onScrollDown();
  }

  checkInvalidQuestion() {
    var invalidQuestion = this.bindData
      .filter(a => a.answer == null || a.answer == '' || a.answer == null || a.answer == '' || a.option1 == null || a.option1 == '' || a.option2 == null || a.option2 == '' || a.option3 == null || a.option3 == '' || a.option4 == null || a.option4 == '' || a.explanations == null || a.explanations == '')
    if (invalidQuestion != null && invalidQuestion.length != 0) {
      this.inavlidQuesData = true;
      invalidQuestion.forEach(element => {
        var index = this.bindData.indexOf(element)
        this.invalidQuestionIndex.push(index)

      });
    }
  }
  getSectionSubjects() {
    if (!(this.sectionSubject.length > 0)) {
      for (let i of this.allSubjectItems) {
        for (let j of this.createmockTestDto.mockTestSection) {
          if (i.id == j.subjectId) {
            this.sectionSubject.push(i)
          }
        }
      }
    }
  }
  previewSelectedQuestions() {
    this.questionService.getQuestionList(this.commonService.questionsIds).subscribe(res => {
      this.questions = this.questions.concat(res);
    })
  }
}

