import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { CommonService } from "@shared/helpers/common.service";
import {
  CourseManagementAppServicesServiceProxy,
  CreateQuestionsDto,
  QuestionDto,
  QuestionServiceProxy,
  SubjectServiceServiceProxy,
  TopicsServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { cloneDeep } from "lodash-es";
import * as moment from "moment";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-create-question",
  templateUrl: "./create-question.component.html",
  styleUrls: ["./create-question.component.scss"],
})
export class CreateQuestionComponent
  extends AppComponentBase
  implements OnInit {
  loading = false;
  question: QuestionDto = new QuestionDto();
  ques: CreateQuestionsDto = new CreateQuestionsDto();
  allSubjects: any = [];
  allCourses: any = [];
  allTopics: any = [];
  selectedTopics: [] = [];
  questions: any = [];
  quest: any = [];
  fileName: any;
  duplicateFile: boolean = false;
  checkSection: boolean = true;
  dropdownSettings;
  dropdownSetting;
  previewedQuestion: any;
  questionIndex: any;
  allDepartments = [];
  @Output() onSave = new EventEmitter<any>();
  isCollapse = true;

  ctc = ` <p mathjax="<math xmlns="http://www.w3.org/1998/Math/MathML"><mml:math xmlns:mml='http://www.w3.org/1998/Math/MathML' xmlns:m='http://schemas.openxmlformats.org/officeDocument/2006/math'><mml:msqrt><mml:mfrac><mml:mrow><mml:mn>1</mml:mn><mml:mo>+</mml:mo><mml:mi mathvariant='bold-italic'>s</mml:mi><mml:mi mathvariant='bold-italic'>i</mml:mi><mml:mi mathvariant='bold-italic'>n</mml:mi><mml:mi mathvariant='bold-italic'>A</mml:mi></mml:mrow><mml:mrow><mml:mn>1</mml:mn><mml:mo>-</mml:mo><mml:mi mathvariant='bold-italic'>s</mml:mi><mml:mi mathvariant='bold-italic'>i</mml:mi><mml:mi mathvariant='bold-italic'>n</mml:mi><mml:mi mathvariant='bold-italic'>A</mml:mi></mml:mrow></mml:mfrac></mml:msqrt></mml:math></math>"> </p>`;
  content = `test abvcd <math xmlns="http://www.w3.org/1998/Math/MathML"><mml:math xmlns:mml='http://www.w3.org/1998/Math/MathML' xmlns:m='http://schemas.openxmlformats.org/officeDocument/2006/math'><mml:msqrt><mml:mfrac><mml:mrow><mml:mn>1</mml:mn><mml:mo>+</mml:mo><mml:mi mathvariant='bold-italic'>s</mml:mi><mml:mi mathvariant='bold-italic'>i</mml:mi><mml:mi mathvariant='bold-italic'>n</mml:mi><mml:mi mathvariant='bold-italic'>A</mml:mi></mml:mrow><mml:mrow><mml:mn>1</mml:mn><mml:mo>-</mml:mo><mml:mi mathvariant='bold-italic'>s</mml:mi><mml:mi mathvariant='bold-italic'>i</mml:mi><mml:mi mathvariant='bold-italic'>n</mml:mi><mml:mi mathvariant='bold-italic'>A</mml:mi></mml:mrow></mml:mfrac></mml:msqrt></mml:math></math>`;

  // mathjax1={mathml:`<math><mml:math xmlns:mml="http://www.w3.org/1998/Math/MathML" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"><mml:msqrt><mml:mfrac><mml:mrow><mml:mn>1</mml:mn><mml:mo>+</mml:mo><mml:mi mathvariant="bold-italic">s</mml:mi><mml:mi mathvariant="bold-italic">i</mml:mi><mml:mi mathvariant="bold-italic">n</mml:mi><mml:mi mathvariant="bold-italic">A</mml:mi></mml:mrow><mml:mrow><mml:mn>1</mml:mn><mml:mo>-</mml:mo><mml:mi mathvariant="bold-italic">s</mml:mi><mml:mi mathvariant="bold-italic">i</mml:mi><mml:mi mathvariant="bold-italic">n</mml:mi><mml:mi mathvariant="bold-italic">A</mml:mi></mml:mrow></mml:mfrac></mml:msqrt></mml:math></math>`}

  mathJaxObject: any;
  constructor(
    private sanitized: DomSanitizer,
    public changeDetect: ChangeDetectorRef,
    public router: Router,
    private _service: QuestionServiceProxy,
    injector: Injector,
    private commonService: CommonService,
    private _subjectService: SubjectServiceServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _topicSerice: TopicsServiceProxy,
    private _apiService: AppSessionService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.content = this.content.replace("mml:", "");
    this.dropdownSetting = {
      singleSelection: false,
      idField: "id",
      textField: "title",
      selectAllText: "Select  ",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.question.courseManagementId = -1;
    this.question.subjectId = -1;
    this.getSubjects();
    this.getCourses();
    var navContent = { title: "Question Management", lengthh: "-1" };
    this.commonService.pageTitle.next(navContent);
  }
  set() {
    this.checkSection = this.checkSection == true ? false : true;
  }

  onSelectAll() {
    this._topicSerice.getAll("", 0, 1000).subscribe((res) => {
      this.allTopics = res.items;
    });
  }

  onUnSelectAll() {
    this.selectedTopics = [];
    this.allTopics = [];
  }
  getSubjects() {
    this._subjectService.getAll("", 0, 100).subscribe((res) => {
      this.allSubjects = res.items;
    });
  }
  getCourses() {
    this._courseService.getAll("", 0, 100).subscribe((res) => {
      this.allCourses = res.items;
    });
  }

  getTopics(event) {
    if (Boolean(event.currentTarget.value)) {
      this._topicSerice
        .getTopicsBasedOnSubject([event.currentTarget.value])
        .subscribe((res) => {
          this.allTopics = res;
          let selectedFilterTopics: any = this.selectedTopics.filter((q: any) =>
            this.allTopics.map((w) => w.id).includes(q.id)
          );
          this.selectedTopics = cloneDeep(selectedFilterTopics);
        });
    }
  }

  // saveDate() {
  //   this.question.createdDate = moment(this.question.createdDate).add("5", "hours").add("30", "minutes");
  // }

  accordionCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  onFileUpload(file) {
    this.loading = true;
    if (file) {
      file = {
        fileName: file[0].name,
        data: file[0],
      };
      this.fileName = file.fileName;

      this._service.previewQuestion(file).subscribe((res) => {
        res.forEach((element) => {
          element.subjectId = this.question.subjectId;
          element.fileName = this.fileName;
          element.topics = this.allTopics.filter((q) =>
            this.selectedTopics.map((a: any) => a.id).includes(q.id)
          );
        });
        this.questions = res;
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
    }
  }

  editPreviewedQuestion(index) {
    this.questionIndex = index;
    this.set();
    this.previewedQuestion = this.questions[index];
  }

  saveQuestion() {
    this.question[this.questionIndex] = this.previewedQuestion;
    this.set();
  }

  save() {
    this._service
      .getQuestionByFileName(this.questions[0].fileName)
      .subscribe((res) => {
        if (res.fileName) {
          this.duplicateFile = true;
        }

        if (
          this.question.courseManagementId == -1 ||
          this.question.fileName == null
        ) {
          this.notify.info("Please Fill the Required Fields");
        } else if (this.duplicateFile == true) {
          this.notify.error(
            "You have already uploaded this file..!! Please select other file."
          );
        } else {
          this._apiService.loading.next(true);

          // this.saveDate();

          this.questions.forEach((res) => {
            res.courseManagementId = this.question.courseManagementId;

            res.fileName = this.fileName;
          });

          this.ques.questions = this.questions;

          this.ques.topicsId = this.selectedTopics.map((b: any) => b.id);

          this._service.createQuestions(this.questions).subscribe((res) => {
            this.notify.info(this.l("SavedSuccessfully"));

            this._apiService.loading.next(false);

            this.onSave.emit();

            this.router.navigate(["/app/question"]);
          },(err)=>{
            this._apiService.loading.next(false);
          });
        }
      });
  }

  cancel() {
    this.router.navigate(["/app/question"]);
  }
}
