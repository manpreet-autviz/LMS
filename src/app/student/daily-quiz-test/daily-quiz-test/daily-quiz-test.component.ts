import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { BlogAppServicesServiceProxy, BlogResultServiceProxy, BlogsDto, BlogUserAnsDto, BlogUserAnsServiceProxy, QuestionBlogDto, QuestionDto, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { cloneDeep } from 'lodash-es';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { ViewBlogResultComponent } from '../view-blog-result/view-blog-result.component';

@Component({
  selector: 'app-daily-quiz-test',
  templateUrl: './daily-quiz-test.component.html',
  styleUrls: ['./daily-quiz-test.component.scss']
})
export class DailyQuizTestComponent extends AppComponentBase implements OnInit {
  id: any;
  allQuestions: any = [];
  filterQuestionsData: any = [];
  isResulted: boolean = false;
  checktype: boolean;
  allAns: any = [];
  isFinish: boolean;
  index = 0;
  isReattempted: boolean=false;
  isResume: boolean;
  timeStart: boolean = false;
  timer = 20;
  mockTest: any = [];
  // @Output() onSave = new EventEmitter<any>();
  selectedIndex: number;
  config: CountdownConfig = { leftTime: 200 };
  tabs: any = [];
  currentTab: any;
  currentTabIndex: any;
  isSectionBased: boolean = false;
  loading = false;
  sectionData: any;
  mockTestSectionData: any;
  sectionDuration: any;
  userId: any;
  repeatCheck: boolean;
  blogDto: BlogsDto = new BlogsDto();
  currentQuestion: BlogUserAnsDto
  @ViewChild("cd", { static: false }) private countdown: CountdownComponent;


  constructor(private route: ActivatedRoute,
     private router: Router,
      private _blogService: BlogAppServicesServiceProxy,
       private _blogUserAnsService: BlogUserAnsServiceProxy, 
       private sessionService: SessionServiceProxy, 
       injector: Injector,
    private activatedRoute: ActivatedRoute,
       private _blogResultService: BlogResultServiceProxy, private _modalService: BsModalService) {
    super(injector);
    this.config = { leftTime: 200 };
  }

  ngOnInit(): void {
    this.loading = true;
    this.sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.userId = res.user.id;
      this.getBlog();
      this.getBlogQuestions();
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
    this.route.params.subscribe((params) => {
      this.id = params.id;
      if(params.result){
        this.id = params.id;
        this.isResulted = true;
        this.getMockTestExplanationById();
      }else{
        this.id = params.id;
      }
    });
   
  }
  ngOnDestroy(): void {
   
    if (this.isResulted) {
      localStorage.removeItem("tab-" + this.id);
      localStorage.removeItem("index-" + this.id);
      localStorage.removeItem("finish-" + this.id);
    }
    // this._mockTestUserAnsService.updateUserMockTestSection(this.userMockTestSection).subscribe();
  }

  getMockTestExplanationById() {
   
    this.loading = true;
    this._blogResultService.getResultById(this.id).subscribe((res) => {
      this.allQuestions = res;

      this.timeStart = false;
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }
  getBlog() {
    this.loading = true;
    this._blogService.get(this.id).subscribe((res) => {
      this.blogDto = res;
      this.timer = res.duration * 60;
      this.timerStart()
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  timerStart() {
    this.config = { leftTime: this.timer };
    this.timeStart = true;
  }

  getBlogQuestions() {
    this.loading = true;
    this._blogUserAnsService.getBlogTestById(this.id, this.isResulted).subscribe(res => {
      this.allQuestions = res;
      if (this.allQuestions.length > 0) {
        if (localStorage.getItem("blog-index-" + this.id)) {
          this.index = parseInt(localStorage.getItem("blog-index-" + this.id));
        }
        if (localStorage.getItem("blog-finish-" + this.id)) {
          this.isFinish = true;
        }
        this.currentQuestion = this.allQuestions[this.index];
        // this.timerStart();
        //  this.currentQuestion.userAnswer = null;
        localStorage.setItem("blog-index-" + this.id, this.index.toString());
       
      }
    },(err)=>{
      this.loading=false;
    });
  }
  back() {
    this.index = this.index - 1;
    this.currentQuestion = cloneDeep(this.allQuestions[this.index]);
    localStorage.setItem("blog-index-" + this.id, this.index.toString());
    this.checkIsFinish();
  }
  skip() {
    this.currentQuestion.skip = !this.currentQuestion.skip;
    this.currentQuestion.isMarkUp = false;
    this.currentQuestion.userAnswer = null;
    this.allQuestions[this.index].skip = cloneDeep(this.currentQuestion.skip);
    this.allQuestions[this.index].isMarkUp = false;
    this.allQuestions[this.index].userAnswer = null;
  }
  markUp() {
    this.currentQuestion.isMarkUp = !this.currentQuestion.isMarkUp;
    this.currentQuestion.skip = false;
    this.currentQuestion.userAnswer = null;
    this.allQuestions[this.index].isMarkUp = cloneDeep(
      this.currentQuestion.isMarkUp
    );
    this.allQuestions[this.index].skip = false;
    this.allQuestions[this.index].userAnswer = null;
  }
  next() {
    if (!this.isFinish) {
      this.index = this.index + 1;
      this.currentQuestion = cloneDeep(this.allQuestions[this.index]);
      localStorage.setItem("blog-index-" + this.id, this.index.toString());
      this.checkIsFinish();
    } else {
      if (this.tabs.length > 1) {
        this.index = this.index + 1;
        //  this.changeFilterQuestion(this.currentTab, this.currentTabIndex);
        this.currentQuestion = cloneDeep(this.allQuestions[this.index]);
        localStorage.setItem("blog-index-" + this.id, this.index.toString());
        this.checkIsFinish();
      } else {
        // this.close(this.id);
      }
    }
  }
  checkIsFinish() {
    let i = cloneDeep(this.index);
    i = i + 1;
    let result = this.allQuestions[i];
    if (result) {
      this.isFinish = false;
      localStorage.removeItem("blog-finish-" + this.id);
    } else {
      this.isFinish = true;
      localStorage.setItem("blog-finish-" + this.id, "true");
    }
  }

  checkBack() {
    let i = cloneDeep(this.index);
    var result = this.allQuestions[i - 1];
    if (result) {
      return false;
    } else {
      return true;
    }
  }
  checkDisable() {
    if (this.currentQuestion?.userAnswer == null) {
      if (this.currentQuestion?.skip == false) {
        if (this.currentQuestion?.isMarkUp == false) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  changeSelection(event, answer) {
    this.currentQuestion.userAnswer = event.target.checked ? answer : null;
    this.allQuestions[this.index].userAnswer = cloneDeep(
      this.currentQuestion.userAnswer
    );
    this.allQuestions[this.index].skip = false;
    this.allQuestions[this.index].isMarkUp = false;
    this.currentQuestion.isMarkUp = false;
    this.currentQuestion.skip = false;
  }
  changeQuestion(index) {
    this.index = index;
    this.currentQuestion = this.allQuestions[index];
    localStorage.setItem("index-" + this.id, index.toString());
    this.checkIsFinish();
  }

  save() {
    if (this.isResulted) {
      return;
    }
    this.allQuestions[this.index].creationTime = moment(
      this.allQuestions[this.index].creationTime
    )
      .add("5", "hours")
      .add("30", "minutes");
    this._blogUserAnsService
      .updateBlogUserAns(this.allQuestions[this.index])
      .subscribe((res) => {
        if (this.isFinish) {
          if (this.tabs.length > 1) {
            if (
              this.currentTabIndex < this.tabs.length - 1 &&
              this.isSectionBased == false
            ) {
              this.currentTabIndex += 1;
            }
            this.currentTab = this.tabs[this.currentTabIndex];
            localStorage.setItem("blog-tab-" + this.id, this.currentTab);
            this.index = -1;
            this.next();
            if (this.isFinish) {
              this.notify.info("click Submit button to submit your test..!");
            }
          } else {
            this.notify.info("click Submit button to submit your test...!");
          }
        } else {
          this.next();
        }
      });
  }
  close() {
    this.router.navigate(['app/student/daily-feed/daily-quiz/'])
  }
  submit() {
    abp.message.confirm(
      this.l("Are you sure...You want to submit your Daily Quiz Test...!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this.loading =
          true;
          this._blogUserAnsService
            .saveResult(this.allQuestions)
            .subscribe((res) => {
              this.allAns = res;
              localStorage.removeItem("blog-tab-" + this.id);
              localStorage.removeItem("blog-index-" + this.id);
              localStorage.removeItem("blog-finish-" + this.id);
              this.loading = false;
              this.notify.success("Submitted Successfully");
              this.viewResult(this.blogDto.id)
              this.close();
            },(err)=>{
              this.loading=false;
            });
        }
      }
    );
  }
  timesUp() {
    abp.message.confirm(
      this.l("Please click submit to submit your test"),
      this.l("Your time is over..!"),
      (result: boolean) => {
        if (result) {
          this.submit();
        } else {
          this.submit();
        }
      }
    );
  }

  viewResult(id: number): void {
    let createOrEditTenantDialog: BsModalRef;
    if (id) {
      createOrEditTenantDialog = this._modalService.show(
        ViewBlogResultComponent,
        {
          class: 'modal-lg modal-dialog-centered',
          initialState: {
            id: id,
          }
        }
      );
    }
  }

  handleEvent(e: CountdownEvent) {
    if (e.action === "done") {
     this.timesUp();
    }
  }

  exit() {
    localStorage.removeItem("blog-tab-" + this.id);
    localStorage.removeItem("blog-index-" + this.id);
    localStorage.removeItem("blog-finish-" + this.id);
    this.router.navigate(['app/student/daily-feed/daily-quiz/'])
    
  }
}
