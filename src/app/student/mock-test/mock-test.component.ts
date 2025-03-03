import { HtmlAstPath } from "@angular/compiler";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Injector,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { CommonService } from "@shared/helpers/common.service";
import {
  EnrollMockTestDto,
  EnrollMockTestServiceProxy,
  MockTestDto,
  MocktestResultDto,
  MockTestResultServiceServiceProxy,
  MockTestServiceProxy,
  MockTestUserAnsDto,
  MockTestUserAnsDtoPagedResultDto,
  MockTestUserAnsServiceProxy,
  QuestionDto,
  SessionServiceProxy,
  User,
  UserMockTestSectionUpdateDto,
} from "@shared/service-proxies/service-proxies";
import { time, timeStamp } from "console";
import { cloneDeep } from "lodash-es";
import * as moment from "moment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import {
  CountdownComponent,
  CountdownConfig,
  CountdownEvent,
} from "ngx-countdown";
import { Location } from "@angular/common";
import { ViewResultComponent } from "./view-result/view-result.component";

@Component({
  selector: "app-mock-test",
  templateUrl: "./mock-test.component.html",
  styleUrls: ["./mock-test.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class MockTestComponent
  extends AppComponentBase
  implements OnInit, OnDestroy, AfterViewInit {
  allQuestions: any = [];
  filterQuestionsData: any = [];
  isResulted: boolean = false;
  currentQuestion: MockTestUserAnsDto;
  checktype: boolean;
  allAns: any = [];
  allMockTestAns: MocktestResultDto;
  id: number;
  isFinish: boolean;
  index = 0;
  isReattempted: boolean;
  isResume: boolean;
  timeStart: boolean = false;
  timer = 20;
  mockTest: any = [];
  mockTestUserAns: MockTestUserAnsDto = new MockTestUserAnsDto();
  @Output() onSave = new EventEmitter<any>();
  selectedIndex: number;
  config: CountdownConfig = { leftTime: 200 };
  tabs: any = [];
  currentTab: any;
  currentTabIndex: any;
  isSectionBased: boolean = false;
  loading = false;
  sectionData: any;
  mockTestSectionData: any;
  commonSubjectNames: any;
  sectionDuration: any;
  userMockTestSection: UserMockTestSectionUpdateDto =
    new UserMockTestSectionUpdateDto();
  userId: any;
  repeatCheck: boolean;
  mockTestDto: MockTestDto = new MockTestDto();
  enrollMock: EnrollMockTestDto = new EnrollMockTestDto();
  checkk: boolean = true;
  @ViewChild("cd", { static: false }) private countdown: CountdownComponent;

  constructor(
    private location: Location,
    private _modalService: BsModalService,
    injector: Injector,
    private _mockTestUserAnsService: MockTestUserAnsServiceProxy,
    private commonService: CommonService,
    private _mockTestResultService: MockTestResultServiceServiceProxy,
    private _mockTestService: MockTestServiceProxy,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionServiceProxy,
    private router: Router,
    private _enrollMockTestService: EnrollMockTestServiceProxy,
    private renderer: Renderer2
  ) {
    super(injector);
    this.config = { leftTime: 200 };


    this.router.events.subscribe((ev) => {
      if (ev) {
        this.renderer.removeClass(document.body, 'sidebar-hide-mock');
      }
    });
    //  this.currentTab=  localStorage.getItem('tab-' + this.currentTab)
    //this.countdown.stop();
  }
  ngOnDestroy(): void {
    if (this.isResulted) {
      localStorage.removeItem("tab-" + this.id);
      localStorage.removeItem("index-" + this.id);
      localStorage.removeItem("finish-" + this.id);
    }
    // this._mockTestUserAnsService.updateUserMockTestSection(this.userMockTestSection).subscribe();
  }
  ngAfterViewInit(): void {
    //this.timeStart = true
    this.activatedRoute.params.subscribe((params) => {
      if (this.isResulted) {
        localStorage.removeItem("tab-" + this.id);
        localStorage.removeItem("index-" + this.id);
        localStorage.removeItem("finish-" + this.id);
      }
      if (params.result) {
        this.id = params.id;
        this.isResulted = true;
        this.getMockTestExplanationById();
      } else if (params.isReattempt) {
        this.isReattempted = true;
        this.id = params.id;
        this.location.go("app/student/mock-test/" + this.id);
        this.getMockTestById();
      } else {
        this.id = params.id;
        // this.getUserMockSection();
      }
    });
    //this.countdown.stop();
    //this.userMockTestSection.duration=
  }
  @HostListener("window:beforeunload") goToPage() {
    //this._mockTestUserAnsService.updateUserMockTestSection(this.userMockTestSection).subscribe();
  }

  ngOnInit(): void {

    this.addBodyClass();
    this.sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.userId = res.user.id;
      this.getMockTest();
      this.getUserMockSection();
    });
    var navContent = { title: "Mock Test", lengthh: "-1" };
    this.commonService.pageTitle.next(navContent);
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
    });
    //  this.config = { leftTime: 20 }
  }
  addBodyClass() {
    const bodyTag = document.body;
    bodyTag.classList.add('sidebar-hide-mock');
  }

  getMockTest() {
    this._mockTestService.get(this.id).subscribe((res) => {
      this.mockTestDto = res;
      this.getEnrolledMockTest();
    });
  }
  getEnrolledMockTest() {
    this._enrollMockTestService
      .getEnrolledMockTestByUserIdAndMockTestId(this.userId, this.id)
      .subscribe((res) => {
        this.enrollMock = res;

      });
  }
  getUserMockSection() {
    this._mockTestUserAnsService
      .getUserMockTestSection(this.id, this.userId)
      .subscribe((res) => {
        this.mockTestSectionData = res;

        if (!this.isResulted) {
          this.getMockTestById();
        }
      });
  }

  pause() {
    this.countdown.pause();
  }

  start() {
    this.countdown.begin();
  }

  getMockTestExplanationById() {
    this.loading = true;
    this._mockTestResultService.getResultById(this.id).subscribe((res) => {
      this.filterQuestionsData = res;
      this.loading = false;
      this.filterQuestions(res);
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }

  checkIsFinish() {
    let i = cloneDeep(this.index);
    i = i + 1;
    let result = this.allQuestions[i];
    if (result) {
      this.isFinish = false;
      localStorage.removeItem("finish-" + this.id);
    } else {
      this.isFinish = true;
      localStorage.setItem("finish-" + this.id, "true");
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

  getMockTestById() {
    this.loading = true;
    if (localStorage.getItem("isResume")) {
      this.isResume = true;
    }
    this._mockTestUserAnsService
      .getMockTestById(this.id, this.isReattempted, this.isResume)
      .subscribe((res) => {
        this.filterQuestionsData = res;
        console.log("this.filterQuestionsData)", this.filterQuestionsData);
        this.filterQuestions(res);
        // this.allQuestions = res;
        if (this.allQuestions.length > 0) {
          if (localStorage.getItem("index-" + this.id)) {
            this.index = parseInt(localStorage.getItem("index-" + this.id));
          }
          if (localStorage.getItem("finish-" + this.id)) {
            this.isFinish = true;
          }
          this.currentQuestion = this.allQuestions[this.index];
          // this.timerStart();
          //  this.currentQuestion.userAnswer = null;
          localStorage.setItem("index-" + this.id, this.index.toString());
          this.loading = false;
        }
      }, (err) => {
        this.loading = false;
      });
  }

  changeFilterQuestion(tab, tabIndex, resp?) {
    this.timeStart = false;
    resp = resp ? resp : this.filterQuestionsData;
    this.currentTab = tab;
    localStorage.setItem("tab-" + this.id, this.currentTab);
    this.currentTabIndex = tabIndex;
    this.currentTabIndex = this.tabs.findIndex(
      (tabs) => tabs == this.currentTab
    );
    this.allQuestions = resp.filter(
      (response) => response.question?.subject?.subjectName === tab
    );
    this.currentQuestion = this.allQuestions[0];
    this.index = 0;
    localStorage.setItem("index-" + this.id, "0");
    if (this.mockTestSectionData && this.mockTestSectionData.length > 0) {
      this.userMockTestSection = this.mockTestSectionData.filter(
        (x) => x.subject.subjectName == tab
      )[0];
      this.timeStart = false;
      console.log(" this.userMockTestSection ", this.userMockTestSection)
      console.log(" this.mockTestSectionData ", this.mockTestSectionData)
      if (this.mockTestDto.duration == 0) {
        this.isSectionBased = true;
        this.timerStart(this.userMockTestSection?.duration);
      } else {
        this.timerStart(this.mockTestDto.duration);
      }
    } else {
      return;
    }

  }

  filterQuestions(response) {
    this.loading = true;
    const responseSubjectNames = new Set(response.map(value => value.question?.subject?.subjectName));
    const mockTestSubjectNames = new Set(this.mockTestSectionData.map(value => value?.subject?.subjectName));
    this.tabs = [
      //  ...new Set(response.map((value) => value.question?.subject?.subjectName)),
      ...new Set(this.commonSubjectNames = this.mockTestSectionData
        .filter(value => responseSubjectNames.has(value?.subject?.subjectName))
        .map(value => value?.subject?.subjectName))

    ];
    if (this.tabs.length > 0) {
      const tab = localStorage.getItem("tab-" + this.id)
        != undefined ? localStorage.getItem("tab-" + this.id)
        : this.tabs[0];
      this.currentTab = tab;

      localStorage.setItem("tab", this.currentTab);
      this.changeFilterQuestion(tab, 0, response);
      this.loading = false;
    } else {
      this.allQuestions = response;
      this.currentQuestion = this.allQuestions[0];
      localStorage.setItem("index-" + this.id, "0");
    }
  }
  skipSection(tab, tabIndex, resp?) {
    abp.message.confirm(
      this.l(
        "You want to move to next section? You won't be able to skip back to this section."
      ),
      undefined,
      (result: boolean) => {
        if (result) {
          this.countdown;
          this.userMockTestSection.isSubmitted = true;
          this.userMockTestSection.creationTime = moment(
            this.userMockTestSection.creationTime
          )
            .add("5", "hours")
            .add("30", "minutes");
          this._mockTestUserAnsService
            .updateUserMockTestSection(this.userMockTestSection)
            .subscribe();
          this.userMockTestSection = this.userMockTestSection =
            this.mockTestSectionData.filter(
              (x) => x.subject.subjectName == tab
            )[0];
          var startMockTime = moment();
          this.userMockTestSection.creationTime = moment(startMockTime);
          this._mockTestUserAnsService
            .updateUserMockTestSection(this.userMockTestSection)
            .subscribe((r) => {
              this._mockTestUserAnsService
                .getUserMockTestSection(this.id, this.userId)
                .subscribe((res) => {
                  this.mockTestSectionData = res;
                  this.changeFilterQuestion(tab, tabIndex, resp);
                });
            });
        }
      }
    );
  }

  changeQuestion(index) {
    this.index = index;
    this.currentQuestion = this.allQuestions[index];
    localStorage.setItem("index-" + this.id, index.toString());
    this.checkIsFinish();
  }

  timerStart(duration: any) {

    var startTime = moment().subtract("5", "hours").subtract("30", "minutes");
    var endTime = cloneDeep(this.userMockTestSection?.creationTime);
    var endTime = endTime?.add("second", duration * 60);
    this.timer = endTime.diff(startTime, "second");

    this.config = { leftTime: this.timer };
    this.timeStart = true;

  }
  back() {
    this.index = this.index - 1;
    this.currentQuestion = cloneDeep(this.allQuestions[this.index]);
    localStorage.setItem("index-" + this.id, this.index.toString());
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
      localStorage.setItem("index-" + this.id, this.index.toString());
      this.checkIsFinish();
    } else {
      if (this.tabs.length > 1) {
        this.index = this.index + 1;
        this.changeFilterQuestion(this.currentTab, this.currentTabIndex);
        this.currentQuestion = cloneDeep(this.allQuestions[this.index]);
        localStorage.setItem("index-" + this.id, this.index.toString());
        this.checkIsFinish();
      } else {
        this.close(this.enrollMock.courseManagementId);
      }
    }
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
    this._mockTestUserAnsService
      .updateMockUserAns(this.allQuestions[this.index])
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
            localStorage.setItem("tab-" + this.id, this.currentTab);
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
  changeSelection(event, answer) {
    if (event.target.checked) {
      this.currentQuestion.userAnswer = event.target.checked ? answer : null;
      this.allQuestions[this.index].userAnswer = cloneDeep(
        this.currentQuestion.userAnswer
      );
    } else {
      this.currentQuestion.userAnswer = null;
    }

    this.allQuestions[this.index].skip = false;
    this.allQuestions[this.index].isMarkUp = false;
    this.currentQuestion.isMarkUp = false;
    this.currentQuestion.skip = false;
  }
  getResult() { }

  submit() {
    abp.message.confirm(
      this.l("Are you sure...You want to submit your mocktest...!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this.loading =
            true;
          this._mockTestUserAnsService
            .saveResult(this.filterQuestionsData)
            .subscribe((res) => {
              this.allAns = res;
              if (this.enrollMock.isSubmitted == false) {
                this._enrollMockTestService
                  .markIsSubmitted(this.enrollMock.id)
                  .subscribe();
              }
              localStorage.removeItem("tab-" + this.id);
              localStorage.removeItem("index-" + this.id);
              localStorage.removeItem("finish-" + this.id);
              this.loading = false;
              this.notify.success("Submitted Successfully");
              this.close(this.enrollMock.courseManagementId);
            }, (err) => {
              this.loading = false;
            });
        }
      }
    );
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
  close(id: any) {
    localStorage.removeItem("index-" + this.id);
    localStorage.removeItem("finish-" + this.id);
    localStorage.removeItem("tab-" + this.id);
    if (this.mockTestDto.isFree) {
      window.opener.location.href = "/#/app/student/my-course/buy/" + id + "/mock-test";
    } else {
      window.opener.location.href = "/#/app/student/my-course/view/" + id + "/mock-test";
    }
    setTimeout(() => {
      this.viewResult(this.enrollMock.mockTestId);
    }, 1000);
  }

  timesUp() {
    abp.message.confirm(
      this.l("Please click submit to submit your test"),
      this.l("Your time is over..!"),
      (result: boolean) => {
        if (result) {
          this.loading =
            true;
          this._mockTestUserAnsService
            .saveResult(this.filterQuestionsData)
            .subscribe((res) => {
              this.allAns = res;
              if (this.enrollMock.isSubmitted == false) {
                this._enrollMockTestService
                  .markIsSubmitted(this.enrollMock.id)
                  .subscribe();
              }
              localStorage.removeItem("tab-" + this.id);
              localStorage.removeItem("index-" + this.id);
              localStorage.removeItem("finish-" + this.id);
              this.loading = false;
              this.notify.success("Submitted Successfully");
              this.close(this.enrollMock.courseManagementId);
            }, (err) => {
              this.loading = false;
            });
        }
      }
    );
    const submitButton = document.querySelector(".swal2-container .swal2-actions .swal2-confirm");
    if (submitButton) {
      submitButton.textContent = "Submit";
    }
    const cancelButton = document.querySelector(".swal2-container .swal2-actions .swal2-cancel");
    cancelButton?.parentNode?.removeChild(cancelButton);

  }

  handleEvent(e: CountdownEvent) {
    if (e.action === "done") {
      if (this.tabs[this.currentTabIndex + 1]) {
        this.repeatCheck = false;
        this.userMockTestSection.isSubmitted = true;
        this.userMockTestSection.creationTime = moment(
          this.userMockTestSection.creationTime
        )
          .add("5", "hours")
          .add("30", "minutes");
        this._mockTestUserAnsService
          .updateUserMockTestSection(this.userMockTestSection)
          .subscribe();
        this.userMockTestSection = this.userMockTestSection =
          this.mockTestSectionData.filter(
            (x) => x.subject.subjectName == this.tabs[this.currentTabIndex + 1]
          )[0];
        var startMockTime = moment();
        this.userMockTestSection.creationTime = moment(startMockTime);
        this._mockTestUserAnsService
          .updateUserMockTestSection(this.userMockTestSection)
          .subscribe((r) => {
            this._mockTestUserAnsService
              .getUserMockTestSection(this.id, this.userId)
              .subscribe((res) => {
                this.mockTestSectionData = res;
                if (!this.repeatCheck) {
                  this.changeFilterQuestion(
                    this.tabs[this.currentTabIndex + 1],
                    this.currentTabIndex + 1
                  );
                  this.repeatCheck = true;
                }
              });
          });
      } else {
        this.timesUp();
      }
    }
  }
  exit() {
    this.enrollMock.courseManagementId
    localStorage.removeItem("index-" + this.enrollMock.courseManagementId);
    localStorage.removeItem("finish-" + this.enrollMock.courseManagementId);
    localStorage.removeItem("tab-" + this.enrollMock.courseManagementId);
    window.close();
  }
  viewResult(id: number): void {
    let createOrEditTenantDialog: BsModalRef;
    if (id) {
      createOrEditTenantDialog = this._modalService.show(ViewResultComponent, {

        backdrop: 'static',
        class: "modal-lg modal-dialog-centered",
        initialState: {
          id: id,
        },
      });
    }
  }

}
