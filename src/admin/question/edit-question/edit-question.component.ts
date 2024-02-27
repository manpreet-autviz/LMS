import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { CommonService } from "@shared/helpers/common.service";
import {
  CourseManagementAppServicesServiceProxy,
  CreateQuestionsDto,
  QuestionDto,
  QuestionServiceProxy,
  SubjectDto,
  SubjectServiceServiceProxy,
  TopicsServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { cloneDeep, takeRightWhile } from "lodash-es";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-edit-question",
  templateUrl: "./edit-question.component.html",
  styleUrls: ["./edit-question.component.scss"],
})
export class EditQuestionComponent extends AppComponentBase implements OnInit {
  id: any;
  createQuestion: CreateQuestionsDto = new CreateQuestionsDto();
  question: QuestionDto = new QuestionDto();
  @Output() onSave = new EventEmitter<any>();
  //allSubjects:any=[];
  allSubjectItems: any = [];
  allTopics: any = [];
  allCourses: any = [];
  selectedSubjects: any = [];
  selectedTopics: [] = [];
  questions: any = [];
  fileName: any;
  dropdownSetting;
  dropdownSettings;
  constructor(
    injector: Injector,
    public router: Router,
    private activatedRouter: ActivatedRoute,
    private _service: QuestionServiceProxy,
    private commonService: CommonService,
    private _subjectService: SubjectServiceServiceProxy,
    private _topicService: TopicsServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _apiService: AppSessionService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.id = params.id;
    });
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
    // this.getQuestions();
    this.getQuestion();
    this.getAllSubItems();
    this.getCourses();
    this.getAllSubject();
    this.getSelectetedTopics();
    var navContent = { title: "Question Management", lengthh: "-1" };
    this.commonService.pageTitle.next(navContent);
  }
  onSelectItems() {
    if (Boolean(this.selectedSubjects.map((a: any) => a.id))) {
      this._topicService
        .getTopicsBasedOnSubject(this.selectedSubjects.map((a: any) => a.id))
        .subscribe((res) => {
          this.allTopics = res;
        });
    }
  }
  getQuestion() {
    this._service.get(this.id).subscribe((res) => {
      this.question = res;
      this.getTopics(this.question.subjectId);
    });
  }
  getCourses() {
    this._courseService.getAll("", 0, 100).subscribe((res) => {
      this.allCourses = res.items;
    });
  }
  onSelectAll() {
    this._topicService.getAll("", 0, 100).subscribe((res) => {
      this.allTopics = res.items;
    });
  }

  onDeSelectItem() {
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

  checkIfRedirected() {
    if (localStorage.getItem("previousLink")) {
      return true;
    }
    return false;
  }

  onUnSelectAll() {
    this.selectedSubjects = [];

    this.selectedTopics = [];

    this.allTopics = [];
  }
  getSelectetedTopics() {
    this._service.getQuestionsTopics(this.id).subscribe((res: any) => {
      this.selectedTopics = res;
    });
  }
  getAllSubItems() {
    this._subjectService.getAll("", 0, 100).subscribe((res) => {
      this.allSubjectItems = res.items;
    });
  }
  getAllTopics(event, id?) {
    var currId = 0;
    if (event == null) {
      currId = id;
    } else {
      currId = event.currentTarget.value;
    }
    if (Boolean(currId)) {
      this._topicService.getTopicsBasedOnSubject([currId]).subscribe((res) => {
        this.allTopics = res;
        this.getSelectetedTopics();
      });
    }
  }

  getTopics(subjectId: any) {
    this._topicService.getTopicsBySubject(subjectId).subscribe((res) => {
      this.allTopics = res;
    });
  }
  getAllSubject() {
    this.selectedSubjects = [];
    this._subjectService.getAll("", 0, 100).subscribe((res) => {
      this.allSubjectItems = res;
      if (Boolean(this.question.selectedSubjects?.length > 0)) {
        this.question.selectedSubjects.forEach((item: SubjectDto) => {
          var subject = { id: item.id, title: item.subjectName };
          this.selectedSubjects.push(subject);
        });
      }
      this.selectedSubjects = cloneDeep(this.selectedSubjects);
    });
  }
  // getTopics() {
  //       if(Boolean(this.selectedSubjects.map((a:any)=>a.id))){
  //         this._topicService.getTopicsBasedOnSubject(this.selectedSubjects.map((a:any)=>a.id)).subscribe(
  //           res => {this.allTopics = res;
  //           })
  //       }
  //     }

  // getQuestions(){
  //   this._service.getQuestions(this.id).subscribe(res=>{
  //     this.questions = res;
  //   })
  // }

  onFileUpload(file) {
    if (file) {
      file = {
        fileName: file[0].name,
        data: file[0],
      };
      this.fileName = file.fileName;
      this._service.previewQuestion(file).subscribe((res) => {
        this.questions = res;
      });
    }
  }

  save() {
    this._apiService.loading.next(true);
    this.createQuestion.question = this.question;
    this.createQuestion.topicsId = this.selectedTopics.map((a: any) => a.id);
    this.createQuestion.subjectId = this.selectedSubjects.map((a: any) => a.id);
    this._service.updateQuestions(this.createQuestion).subscribe((res) => {
      this.notify.info(this.l("SavedSuccessfully"));
      this._apiService.loading.next(false);

      if (this.checkIfRedirected()) {
        this.router.navigate([
          "/app/edit-mocktests",
          localStorage.getItem("previousLink"),
        ]);
      } else {
        this.onSave.emit();
        this.router.navigate(["/app/question"]);
      }
    },(err)=>{
      this._apiService.loading.next(false);
    });
  }
  cancel() {
    this.router.navigate(["/app/question"]);
  }
}
