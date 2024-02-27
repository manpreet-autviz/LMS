import {
  EventEmitter,
  Component,
  OnInit,
  Output,
  Injector,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { CommonService } from "@shared/helpers/common.service";
import {
  CommonServiceServiceProxy,
  CourseManagementAppServicesServiceProxy,
  CourseManagementDto,
  CreateMockTestDto,
  CreateQuestionsDto,
  MockTestDto,
  MockTestServiceProxy,
  QuestionServiceProxy,
  SubjectDto,
  SubjectServiceServiceProxy,
  TopicsDto,
  TopicsServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { time } from "console";
import { cloneDeep } from "lodash-es";
import * as moment from "moment";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-edit-mocktest",
  templateUrl: "./edit-mocktest.component.html",
  styleUrls: ["./edit-mocktest.component.scss"],
})
export class EditMocktestComponent extends AppComponentBase implements OnInit {
  butDisabled = "disabled";
  id: any;
  courseId: any;
  mockTest: MockTestDto = new MockTestDto();
  allCourses: any = [];
  allSubjectItems: any = [];
  date: any = [];
  selectedTopics: [] = [];
  dropdownSettings;
  allTopics: any = [];
  selectedSubjects: any = [];
  dropdownSetting;
  fileName: any;
  questions: any[] = [];
  question: any[] = [];
  isCollapse = true;
  bindData: any[] = [];
  multitopicData: any = [];
  showFile: string;
  isImageUpladedStatus: string = "";
  previewedQuestion: any;
  questionIndex: any;
  checkSection: boolean = true;
  loading = false;
  course: CourseManagementDto = new CourseManagementDto();
  createMockTest: CreateMockTestDto = new CreateMockTestDto();
  createQuestion: CreateQuestionsDto = new CreateQuestionsDto();
  @Output() onSave = new EventEmitter<any>();
  array = [];
  sum: any = 0;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = "";
  modalOpen = false;
  isQuestionLoading:boolean;
  next :any;
  iterator:any;
 constructor(
    injector: Injector,
    private _commonService: CommonServiceServiceProxy,
    public router: Router,
    private commonService: CommonService,
    private activeRouter: ActivatedRoute,
    private _mocktestService: MockTestServiceProxy,
    private _subjectService: SubjectServiceServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _topicService: TopicsServiceProxy,
    private _apiService: AppSessionService,
    private _questionservice: QuestionServiceProxy,
    private questionService: QuestionServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.iterator = function (a, n) {
      var current = 0,
        l = a.length;
      return function () {
        var end = current + n;
        var part = a.slice(current, end);
        current = end < l ? end : 0;
        return part;
      };
    };
    if (localStorage.getItem("previousLink")) {
      localStorage.removeItem("previousLink");
    }
    this.activeRouter.params.subscribe((params) => {
      this.id = params.id;
    });
    // this.appendItems(0, this.sum);

    this.getMockTestQuestions();
    this.getAllCourses();
    this.getMockTests();
    this.getAllTopics();
    this.getAllSubItems();

    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "title",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };
    this.dropdownSetting = {
      singleSelection: false,
      idField: "id",
      textField: "subjectName",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };
    var navContent = { title: "MockTest Management", lengthh: "-1" };
    this.commonService.pageTitle.next(navContent);
  }
  editQuestions(id: number) {
    localStorage.setItem("previousLink", this.id);
    this.router.navigate(["/app/edit-question/" + id]);
  }
  onSelectAll() {
    this._topicService.getAll("", 0, 1000).subscribe((res) => {
      this.allTopics = res.items;
    });
  }
  onItemDeSelect() {
    if (Boolean(this.selectedSubjects.map((a: any) => a.id))) {
      this._topicService
        .getTopicsBasedOnSubject(this.selectedSubjects.map((a: any) => a.id))
        .subscribe((res) => {
          this.allTopics = res;
          let selectedFilterTopics: any = this.selectedTopics.filter((q: any) =>
            this.allTopics.map((w) => w.id).includes(q.id)
          );
          this.selectedTopics = cloneDeep(selectedFilterTopics);
        });
    }
  }

  onUnSelectAll() {
    (this.selectedSubjects = []), (this.selectedTopics = []);
    this.allTopics = [];
  }
  onSelectItem() {
    if (Boolean(this.selectedSubjects.map((a: any) => a.id))) {
      this._topicService
        .getTopicsBasedOnSubject(this.selectedSubjects.map((a: any) => a.id))
        .subscribe((res) => {
          this.allTopics = res;
        });
    }
  }
  getMockTests() {
    this._mocktestService.get(this.id).subscribe((res) => {
      this.mockTest = res;
      this.getCourse(this.mockTest.courseManagementId)
    });

  }
  getMockTestQuestions() {
    this._mocktestService.getMockTestQuestions(this.id).subscribe((res) => {
      this.questions = res
      if (this.questions.length > 10) {
        this.lazyLoader(this.questions)

      }else{
        this.question = res
        this.isQuestionLoading = true;
      }
    }, (err) => {
      this.loading = false;
    });
  }
  onScrollDown() {
    this.isQuestionLoading = true;
    this.direction = "down";
    var part = this.next();
    this.question = this.question.concat(part);
    setTimeout(() => {
      this.isQuestionLoading = false;
    }, 2000)
  }
  lazyLoader(questions) {
    this.sum = questions.length;
    this.next = this.iterator(questions, 10);
    this.onScrollDown();
  }

  getAllTopics() {
    if (Boolean(this.selectedSubjects.map((a: any) => a.id))) {
      this._topicService
        .getTopicsBasedOnSubject(this.selectedSubjects.map((a: any) => a.id))
        .subscribe((res) => {
          this.allTopics = res;
          this.multitopicData.topics = res;
          if (this.multitopicData.topics.length > 0) {
          }
        });
    } else {
      this._topicService.getAll("", 0, 1000).subscribe((res) => {
        this.allTopics = res.items;
      });
    }
  }

  getAllCourses() {
    this._courseService.getAllDataBasedOnCategory(-1, 'HybridMock').subscribe(res => {
      this.allCourses = res;
    });
  }

  getAllSubItems() {
    this._subjectService.getAll("", 0, 100).subscribe((res) => {
      this.allSubjectItems = res.items;
    });
  }
  getCourse(courseId: any) {

    this._courseService.get(courseId).subscribe((res) => {
      this.course = res;
    })
  }
  set() {
    this.checkSection = this.checkSection == true ? false : true;
  }
  editPreviewedQuestion(index) {
    this.questionIndex = index;
    this.set();
    this.previewedQuestion = cloneDeep(this.questions[index]);
  }

  saveQuestion() {
    if (this.previewedQuestion.questions == null || this.previewedQuestion.questions == '' || this.previewedQuestion.option1 == null || this.previewedQuestion.option1 == '' || this.previewedQuestion.option2 == null || this.previewedQuestion.option2 == ''
      || this.previewedQuestion.option3 == null || this.previewedQuestion.option3 == '' || this.previewedQuestion.option5 ==''|| this.previewedQuestion.option4 == null || this.previewedQuestion.option4 == '' || this.previewedQuestion.answer == null || this.previewedQuestion.answer == '' || this.previewedQuestion.explanations == null || this.previewedQuestion.explanations == '') {
      this.notify.success("please fill required fields");
    }
    else {
      if (this.question[this.questionIndex] != null) {
        this.question[this.questionIndex] = this.previewedQuestion;
      }
      this.questions[this.questionIndex] = this.previewedQuestion;
      this.set();
      this.notify.success("update question");
    }

  }

  cancelEditQuestion(index) {
    this.questionIndex = index;
    this.set();
    this.previewedQuestion = this.questions[index];
  }
  onFileUpload(file) {
    if (file) {
      file = {
        fileName: file[0].name,
        data: file[0],
      };
      this.fileName = file.fileName;
      this.questionService
        .previewQuestion(file)
        .subscribe((res) => (this.questions = res));
    }
  }

  onUpload(file) {
    if (file) {
      this.isImageUpladedStatus = "start";
      file = {
        fileName: file[0].name,
        data: file[0],
      };
    }
    this._commonService.uploadImage(file).subscribe((res) => {
      this.isImageUpladedStatus = "end";
      this.mockTest.uploadFile = res.saveLink;
      this.showFile = res.showLink;
    });
  }
  accordionCollapse() {
    this.isCollapse = !this.isCollapse;
  }
  save() {
    if (this.mockTest.title == null || this.mockTest.title == '' ||
      this.mockTest.uploadFile == '' || this.mockTest.uploadFile == null) {
      this.notify.info("Please fill the required fields.")
    }
    else if (this.mockTest.isNegativeMarking == true && this.mockTest.eachQuestionNegativeMarking <= 0) {
      this.notify.info(" EachQuestion Negative Marking can't  be 0 and less then 0.. !")
    } else if (this.mockTest.eachQuestionNumber <= 0) {
      this.notify.info(" EachQuestion Question Marks can't  be 0 and less then 0.. !")
    }
    else {
      this._apiService.loading.next(true);

      this.createMockTest.mockTests = this.mockTest;
      this.createMockTest.questionIndex = this.questions
      this._questionservice.updateQuestion(this.questions).subscribe((res) => {
        this._mocktestService
          .updateMockTests(this.createMockTest)
          .subscribe((res) => {
            this.notify.info(this.l("SavedSuccessfully"));
            this._apiService.loading.next(false);
            this.onSave.emit();
            this.router.navigate(["/app/mocktests"]);
          });
      },(err)=>{
        this._apiService.loading.next(false);
      });
    }
  }

  cancel() {
    this.router.navigate(["/app/mocktests"]);
  }


}

