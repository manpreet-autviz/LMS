import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { AppComponentBase } from "@shared/app-component-base";
import { CommonService } from "@shared/helpers/common.service";
import {
  BlogAppServicesServiceProxy,
  BlogsDto,
  CommonServiceServiceProxy,
  CourseManagementAppServicesServiceProxy,
  CreateBlogsDto,
  QuestionServiceProxy,
  SubjectServiceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { cloneDeep, takeRightWhile } from "lodash-es";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-edit-blogs",
  templateUrl: "./edit-blogs.component.html",
  styleUrls: ["./edit-blogs.component.scss"],
})
export class EditBlogsComponent extends AppComponentBase implements OnInit {
  blogs: BlogsDto = new BlogsDto();
  blogManagement: CreateBlogsDto = new CreateBlogsDto();
  allSubjects: any = [];
  allCourses: any = [];
  allBlogs: any = [];
  id: any;
  isImageUpladedStatus: string = "";
  imageFile: string;
  isDisabled: boolean = true;
  questins: any;
  questions: any = [];
  allQuestions: any = [];
  isCollapse = true;
  previewedQuestion: any;
  questionIndex: any;
  checkSection: boolean = true;
  loading = false;
  sum: any = 0;
  direction = "";
  modalOpen = false;
  isQuestionLoading: boolean;
  next: any;
  iterator: any;
  @Output() onSave = new EventEmitter<any>();
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
      ],
      [
        'customClasses',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };
  constructor(
    public commonService: CommonServiceServiceProxy,
    private common: CommonService,
    injector: Injector,
    public router: Router,
    private activatedRouter: ActivatedRoute,
    private _subjectService: SubjectServiceServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _blogsService: BlogAppServicesServiceProxy,
    private _apiService: AppSessionService,
    private _questionService: QuestionServiceProxy
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
    var navContent = { title: "Blog Management", lengthh: "-1" };
    this.common.pageTitle.next(navContent);
    this.activatedRouter.params.subscribe((params) => {
      this.id = params.id;
    });
    if (this.blogs.subjectId == null) {
      this.blogs.subjectId = 0;
    }
    if (this.blogs.type == null) {
      this.blogs.type = "";
    }
    this.getBlogs();
    this.getSubjects();
    if (!(this.common.questionsIds.length > 0)) {
      this.getBlogQuestions();
    } else if (this.blogs.type == "Daily Quiz") {
      this.previewSelectedQuestions();
    }
  }



  getBlogQuestions() {
    this.loading = true;
    this._blogsService.getBlogsQuestions(this.id).subscribe((res) => {
      this.common.questionsIds = res.map((x) => x.id);
      this.previewSelectedQuestions();
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }
  getSubjects() {
    this._subjectService.getAll("", 0, 100).subscribe((res) => {
      this.allSubjects = res.items;
    });
  }
  getBlogs() {
    this._blogsService.get(this.id).subscribe((res) => {
      this.blogs = res;
      // this.imageFile = this.blogs.fileName
      this.imageFile = this.blogs.image;
    });
  }

  manageQuestions() {
    this.common.craeteBlog = cloneDeep(this.blogs);
    localStorage.setItem("isCallFromEditBlog", "true");
    this.router.navigate(["/app/question"]);
  }
  set() {
    this.checkSection = this.checkSection == true ? false : true;
  }

  editPreviewedQuestion(index) {
    this.questionIndex = index;
    this.set();
    this.previewedQuestion = cloneDeep(this.allQuestions[index]);
  }

  saveQuestion() {
    if (this.previewedQuestion.questions == null || this.previewedQuestion.questions == '' || this.previewedQuestion.option1 == null || this.previewedQuestion.option1 == '' || this.previewedQuestion.option2 == null || this.previewedQuestion.option2 == ''
      || this.previewedQuestion.option3 == null || this.previewedQuestion.option3 == '' || this.previewedQuestion.option5 ==''|| this.previewedQuestion.option4 == null || this.previewedQuestion.option4 == '' || this.previewedQuestion.answer == null || this.previewedQuestion.answer == '' || this.previewedQuestion.explanations == null || this.previewedQuestion.explanations == '') {
      this.notify.success("please fill required fields");
    }
    else {
      this.allQuestions[this.questionIndex] = this.previewedQuestion;
      if(this.questions[this.questionIndex]!=null){
        this.questions[this.questionIndex] = this.previewedQuestion;
      }
      this.set();
      this.notify.success("update question");
    }

  }

  cancelEditQuestion(index) {
    this.questionIndex = index;
    this.set();
    this.previewedQuestion = this.allQuestions[index];
  }
  save() {

    if (this.imageFile == null) {
      this.imageFile = "";
    }
    if (this.blogs.type == "Video") {
      this.imageFile = "";
    }
    if (this.blogs.title == null || this.blogs.title == "" || this.blogs.type == "" || this.blogs.subjectId == 0 || (this.blogs.type == "Current Affairs" && (this.blogs.description == null || this.blogs.description == "" || this.blogs.image == "")) || (this.blogs.type == "Video" && (this.blogs.fileName == null || this.blogs.fileName == ""))) {
      this.notify.info("Please fill the required fields")
    }

    else if (this.blogs.type == "Daily Quiz") {
      if (this.blogs.title == null || this.blogs.subjectId == 0 || this.blogs.uploadQuestionFile == null || this.blogs.duration == null) {
        this.notify.info("Please fill the required fields")
      }
      else {
        this._apiService.loading.next(true);
        // this.blogs.fileName = this.imageFile;
        this.blogs.image = this.imageFile;
        this.blogManagement.blogs = this.blogs;
        this.blogManagement.questionIndex = this.common.questionsIds;
        this._questionService.updateQuestion(this.allQuestions).subscribe((res) => {
          this.blogManagement.questionIndex = [];
          this._blogsService.updateblogs(this.blogManagement).subscribe((res) => {
            this.notify.info(this.l("SavedSuccessfully"));
            this.common.questionsIds = [];
            this._apiService.loading.next(false);
            this.onSave.emit();
            this.router.navigate(["/app/blogs"]);
          });
        });
      }
    }
    else {
      this._apiService.loading.next(true);
      // this.blogs.fileName = this.imageFile;
      this.blogs.image = this.imageFile;
      this.blogManagement.blogs = this.blogs;
      this.blogManagement.questionIndex = this.common.questionsIds;
      this._blogsService.updateblogs(this.blogManagement).subscribe((res) => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.common.questionsIds = [];
        this._apiService.loading.next(false);
        this.onSave.emit();
        this.router.navigate(["/app/blogs"]);
      });

    }
  }
  cancel() {
    this.common.questionsIds = [];
    this.router.navigate(["/app/blogs"]);
  }

  onUpload(file) {
    if (file) {
      this.isImageUpladedStatus = "start";
      file = {
        fileName: file[0].name,
        data: file[0],
      };
    }
    this.commonService.uploadImage(file).subscribe((res) => {
      this.isImageUpladedStatus = "end";
      //   this.blogs.fileName = res.showLink;
      this.blogs.image = res.showLink;
      this.imageFile = res.saveLink;
    });
  }
  previewSelectedQuestions() {
    this._questionService
      .getQuestionList(this.common.questionsIds)
      .subscribe((res) => {
        this.allQuestions = res;
        if (this.allQuestions.length > 10) {
          this.lazyLoader(this.allQuestions)
        } else {
          this.questions = res;
          this.isQuestionLoading = true;
        }

      });
  }

  onScrollDown() {
    this.isQuestionLoading = true;
    this.direction = "down";
    var part = this.next();
    this.questions = this.questions.concat(part);
    setTimeout(() => {
      this.isQuestionLoading = false;
    }, 4000)

  }




  lazyLoader(questions) {
    this.sum = questions.length;
    this.next = this.iterator(questions, 10);
    this.onScrollDown();
  }


  accordingCollapse() {
    this.isCollapse = !this.isCollapse;
  }
}
