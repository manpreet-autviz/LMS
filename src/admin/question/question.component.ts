import {
  AfterViewInit,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import {
  CourseManagementAppServicesServiceProxy,
  QuestionDto,
  QuestionServiceProxy,
  SubjectServiceServiceProxy,
  TopicsServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { DataTableDirective } from "angular-datatables";
import { debug } from "console";
import { cloneDeep } from "lodash-es";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { CommonService } from "../../../src/shared/helpers/common.service";
import { CreateQuestionComponent } from "./create-question/create-question.component";
import { EditQuestionComponent } from "./edit-question/edit-question.component";

@Component({
  selector: "app-question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"],
})
export class QuestionComponent
  extends AppComponentBase
  implements OnInit, AfterViewInit, OnDestroy {
  allQuestions: any = [];
  id: any;
  allQuestionsFileName: any = [];
  checkType: boolean;
  selectedFile: boolean = false;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  title = "datatables";
  dtTrigger: Subject<any> = new Subject<any>();
  index = 0;
  isFinish: boolean;
  isMarkAllButton: boolean = false;
  dtOptions: DataTables.Settings = {
    pagingType: "simple_numbers",
    pageLength: 10,
    lengthMenu: [
      [10, 50, 100, 200, 500, -1],
      [10, 50, 100, 200, 500, "All"],
    ],
    order: [],
  };
  selectedSubject: any = "";
  allCourses: any = [];
  allSubjects: any = [];
  allTopics: any = [];
  question: QuestionDto = new QuestionDto();
  loading = false;
  dropdownSettings;
  dropdownSetting;
  selectedItem: any = [];
  selectedTopics: any = [];
  filterSubjectIds = [];
  filterTopicIds = [];
  courseId = 0;
  fileName: string;
  isCallFromBlog: boolean;
  isQuestionAdd: boolean = false;
  markedQuestion: any = [];
  constructor(
    injector: Injector,
    private commonService: CommonService,
    private router: Router,
    private _topicService: TopicsServiceProxy,
    private _service: QuestionServiceProxy,
    private _subjectService: SubjectServiceServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (localStorage.getItem("isCallFromCreateBlog")) {
      this.isCallFromBlog = true;
    }
    if (
      localStorage.getItem("isCallFromEditBlog") ||
      localStorage.getItem("isCallFromCreateMockTest")
    ) {
      this.isCallFromBlog = true;
    }
    if (localStorage.getItem("isCallFromCreateMockTest")) {
      this.isCallFromBlog = true;
    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "title",
      selectAllText: "Select All ",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.dropdownSetting = {
      singleSelection: false,
      idField: "id",
      textField: "subjectName",
      selectAllText: "Select All ",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.question.courseManagementId = 0;
    this.fileName = "";
    this.question.fileName = "";
    //this.getAllQuestions();
    this.getAllCourses();
    this.getSubjects();
    this.getTopics();
    this.getAllQuestionFileName();
  }
  getAllQuestionFileName() {
    this._service.getAllQuestionFileName().subscribe((res) => {
      this.allQuestionsFileName = res;
    });
  }
  onSelectAll() {
    this._topicService.getAll("", 0, 1000).subscribe((res: any) => {
      this.allTopics = res.items;
      this.filterSubjectIds = this.selectedItem.map((a: any) => a.id);
      this.getAllQuestionFilters();
    });
  }
  onItemDeSelect() {
    this.getTopics();
  }

  onUnSelectAll() {
    (this.selectedItem = []),
      (this.selectedSubject = []),
      (this.selectedTopics = []);
    this.allTopics = [];
  }
  // onDeselectTopics(){
  //   this.filterSubjectIds = this.selectedItem((a:any)=> a.id);
  //   this.getAllQuestions();

  // }
  // onSelectAllTopics(){
  //   this._topicService.getTopicsBasedOnSubject(this.selectedItem.map((a:any)=>a.id)).subscribe(
  //     res=>{
  //       this.allTopics = res;
  //       let selectedFilterTopics : any = this.selectedTopics.filter((q:any)=> this.allTopics.map(w=>w.id).includes(q.id));
  //       this.filterTopicIds = cloneDeep(selectedFilterTopics)
  //       this.filterTopicIds = this.selectedTopics.map((a:any)=>a.id)
  //       this.getAllQuestions();

  //     }
  //   )
  // }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    if (this.isQuestionAdd == false) {
      this.commonService.questionsIds = [];
      this.commonService.craeteBlog.type = undefined;
    }
    localStorage.removeItem("isCallFromCreateBlog");

    this.dtTrigger.unsubscribe();
  }

  renderer(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  }

  getAllCourses() {
    this._courseService.getAll("", 0, 100).subscribe((res) => {
      this.allCourses = res.items;
    });
  }

  addQuestion(event, id) {
    if (event.target.checked) {
      this.commonService.questionsIds.push(id);
    } else {
      this.commonService.questionsIds = this.commonService.questionsIds.filter(
        (q) => q != id
      );
    }
  }
  markAllQuestion() {
    this.markedQuestion = [];
    if (this.isMarkAllButton) {
      this.allQuestions.forEach(element => {
        element.isMarkDelete = false;
      });
      this.isMarkAllButton = false;
    }
    else {
      this.allQuestions.forEach(element => {
        element.isMarkDelete = true;
        this.markedQuestion.push(element.id);
      });
      this.isMarkAllButton = true;
    }
  }
  addQuestionToDelete(event, id) {
    if (event.target.checked) {
      this.markedQuestion.push(id);
    } else {
      this.markedQuestion = this.markedQuestion.filter(
        (q) => q != id
      );
    }
  }

  deleteSelectedQuestion() {
    this._service.deleteSelectedQuestion(this.markedQuestion).subscribe(res => {
      this.getAllQuestionFilters();
    });
    this.notify.info("Questions Successfully Deleted");
    this.markedQuestion = [];
  }

  backToBlogs() {
    this.isQuestionAdd = true;
    this.commonService.questionsIds = [];
    if (localStorage.getItem("isCallFromCreateBlog")) {
      localStorage.removeItem("isCallFromCreateBlog");
      localStorage.removeItem("isCallFromEditBlog");
      this.router.navigate(["/app/create-blogs"]);
    }
    if (localStorage.getItem("isCallFromEditBlog")) {
      localStorage.removeItem("isCallFromCreateBlog");
      localStorage.removeItem("isCallFromEditBlog");
      this.router.navigate([
        "/app/edit-blogs/" + this.commonService.craeteBlog.id,
      ]);
    }
    if (localStorage.getItem("isCallFromCreateMockTest")) {
      localStorage.removeItem("isCallFromCreateMockTest");
      this.router.navigate(["/app/create-mocktests"]);
    }
  }
  checkback() {
    this.isQuestionAdd = true;
    if (localStorage.getItem("isCallFromCreateBlog")) {
      localStorage.removeItem("isCallFromCreateBlog");
      localStorage.removeItem("isCallFromEditBlog");
      this.router.navigate(["/app/create-blogs"]);
    }
    if (localStorage.getItem("isCallFromEditBlog")) {
      localStorage.removeItem("isCallFromCreateBlog");
      localStorage.removeItem("isCallFromEditBlog");
      this.router.navigate([
        "/app/edit-blogs/" + this.commonService.craeteBlog.id,
      ]);
    }
    if (localStorage.getItem("isCallFromCreateMockTest")) {
      localStorage.removeItem("isCallFromCreateMockTest");
      this.router.navigate(["/app/create-mocktests"]);
    }
  }
  disableButton() {
    this.checkType = true;
  }

  getSubjects() {
    this._subjectService.getAll("", 0, 100).subscribe((res) => {
      this.allSubjects = res.items;
    });
  }

  getTopics() {
    if (Boolean(this.selectedItem.map((a: any) => a.id))) {
      this._topicService
        .getTopicsBasedOnSubject(this.selectedItem.map((a: any) => a.id))
        .subscribe((res) => {
          this.allTopics = res;

          let selectedFilterTopics: any = this.selectedTopics.filter((q: any) =>
            this.allTopics.map((w) => w.id).includes(q.id)
          );
          this.selectedTopics = cloneDeep(selectedFilterTopics);
        });
    }
    this.filterSubjectIds = this.selectedItem.map((a: any) => a.id);
    this.getAllQuestionFilters();

  }

  setSubject() {
    if (Boolean(this.selectedSubject)) {
      this.filterSubjectIds = this.selectedSubject.map((a: any) => a.id);
    }
  }

  setTopic() {
    if (Boolean(this.selectedTopics)) {
      this.filterTopicIds = this.selectedTopics.map((a: any) => a.id);
    }
  }
  getAllQuestions() {
    //this.loading = true
    this._service
      .getAllQuestion(
        this.courseId,
        this.filterSubjectIds,
        this.filterTopicIds,
        this.fileName
      )
      .subscribe((res) => {
        this.allQuestions = res;
        var navContent = {
          title: "Question Management",
          lengthh: this.allQuestions.length,
        };
        this.commonService.pageTitle.next(navContent);
        // this.loading = false
        this.renderer();
      });
  }
  getAllQuestionFilters() {
    this.loading = true;
    if (localStorage.getItem("isCallFromCreateMockTest")) {
      this.filterSubjectIds[0] = localStorage.getItem(
        "isCallFromCreateMockTest"
      );
    }
    this._service
      .getAllQuestionFilters(
        this.courseId,
        this.filterSubjectIds,
        this.filterTopicIds,
        this.fileName
      )
      .subscribe((res) => {
        this.allQuestions = res;
        if (this.fileName != '') {
          this.selectedFile = true;
          this.isMarkAllButton = false;
          this.markedQuestion = [];
        }
        var navContent = {
          title: "Question Management",
          lengthh: this.allQuestions.length,
        };
        this.commonService.pageTitle.next(navContent);
        this.loading = false;
        this.renderer();
      },(err)=>{
        this.loading=false;
      });
  }

  showCreateOrEditDialog(id?: number): void {
    if (!id) {
      this.router.navigate(["/app/create-question"]);
    } else {
      this.router.navigate(["/app/edit-question/" + id]);
    }
  }

  delQuestion(question: any) {
    abp.message.confirm(
      this.l("This question will be deleted....!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._service.delete(question.id).subscribe((res) => {
            this.notify.success("Deleted SuccessFully");
            this.getAllQuestionFilters();
          });
        }
      }
    );
  }
}
