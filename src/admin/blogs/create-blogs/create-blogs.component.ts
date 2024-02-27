import { AfterViewInit, Component, EventEmitter, Injector, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { BlogAppServicesServiceProxy, BlogsDto, CommonServiceServiceProxy, CourseManagementAppServicesServiceProxy, CreateBlogsDto, QuestionDto, QuestionServiceProxy, SubjectServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { cloneDeep } from 'lodash-es';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Editor, Toolbar } from 'ngx-editor';
import { threadId } from 'worker_threads';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-create-blogs',
  templateUrl: './create-blogs.component.html',
  styleUrls: ['./create-blogs.component.scss']
})
export class CreateBlogsComponent extends AppComponentBase implements OnInit, AfterViewInit {

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
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
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  blogs: BlogsDto = new BlogsDto();
  blogsQuestion: any = []
  createblogsDto: CreateBlogsDto = new CreateBlogsDto();
  question: QuestionDto = new QuestionDto();
  allSubjects: any = [];
  allCourses: any = [];
  isImageUpladedStatus: string = "";
  imageFile: string;
  isCollapse = true
  questions: any = [];
  allQuestions: any = [];
  fileName: any
  questionFile: any
  blogsData: any = [];
  loading = false;
  previewedQuestion: any;
  questionIndex: any;
  checkSection: boolean = true;
  isFileUpladedStatus: string
invalidQuestionIndex:any[]=[];
inavlidQuesData:boolean=false;
next: any;
iterator: any;
isQuestionLoading: boolean
direction: string;
sum: any = 0;
nextQuestion :boolean=false;
  @Output() onSave = new EventEmitter<any>();
  location: any;
  constructor(public commonService: CommonServiceServiceProxy,
    private common: CommonService,
    injector: Injector,
    public router: Router,
    private _subjectService: SubjectServiceServiceProxy,
    private questionservice: QuestionServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _blogsService: BlogAppServicesServiceProxy,
    private _apiService: AppSessionService,
    private questionService: QuestionServiceProxy) {
    super(injector)
  }
  ngOnInit(): void {
    
    this.iterator = function (a, n) {
      var current = 0,
        l = a.length;
      return function () {
        if(this.nextQuestion==true){
          this.nextQuestion=false;
          a = this.allQuestions
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
    if (this.common.craeteBlog.type == undefined) {
      this.blogs.subjectId = 0;
      this.blogs.type = "";
      this.blogs.status = true;
      this.getSubjects();
      // this.blogs.fileName = "";
      this.blogs.image = "";
      this.common.questionsIds = [];
    }
  }


  ngAfterViewInit(): void {
    // this.blogs.fileName = "";
    this.blogs.image = "";
    var navContent = { title: "Blog Management", lengthh: "-1" }
    this.common.pageTitle.next(navContent)
    if (this.common.craeteBlog.type != undefined || this.common.questionsIds.length > 0) {
      this.blogs = cloneDeep(this.common.craeteBlog);
      this.getSubjects();
      this.common.craeteBlog = new BlogsDto();
      this.previewSelectedQuestions();
    }
    else {
      this.blogs.subjectId = 0;
      this.blogs.type = "";
      this.blogs.status = true;
      this.getSubjects();
      // this.blogs.fileName = "";
      this.blogs.image = "";
    }

  }
  getSubjects() {
    this._subjectService.getAll("", 0, 100).subscribe(res => {
      this.allSubjects = res.items;
    })
  }
  getCourses() {
    this._courseService.getAll("", 0, 100).subscribe(res => {
      this.allCourses = res.items;
    })
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
    this.previewedQuestion=  cloneDeep(this.allQuestions[index]);

  }
  cancelEditQuestion(index){
    this.questionIndex = index;
    this.set();
    this.previewedQuestion = this.allQuestions[index];
  }
  saveQuestion() {

    if (this.previewedQuestion.questions == null || this.previewedQuestion.questions == '' || this.previewedQuestion.option1 == null || this.previewedQuestion.option1 == '' || this.previewedQuestion.option2 == null || this.previewedQuestion.option2 ==''
      || this.previewedQuestion.option3 == null || this.previewedQuestion.option3 == ''|| this.previewedQuestion.option5 =='' || this.previewedQuestion.option4 == null || this.previewedQuestion.option4 == '' || this.previewedQuestion.answer == null || this.previewedQuestion.answer == '' || this.previewedQuestion.explanations == null || this.previewedQuestion.explanations == '' ){
      this.notify.success("please fill required fields");
    }
    else{
      this.allQuestions[this.questionIndex] = this.previewedQuestion;
      this.nextQuestion =true;

      if(this.questions[this.questionIndex]!=null){
        this.questions[this.questionIndex] = this.previewedQuestion;
        this.nextQuestion =false;
      }
      this.set();
    
      this.invalidQuestionIndex = [];
      this.inavlidQuesData = false;
      this.checkInvalidQuestions();
      this.notify.success("update question");
    }

  }

  changeType(){
    this.common.questionsIds =[]
    this.questions = [];
  }
  save() {
   
    if (this.blogs.type == "Video") {
      this.imageFile = "";
    }
    if (this.blogs.title == null || this.blogs.title == "" || this.blogs.type == "" || this.blogs.subjectId == 0||(this.blogs.type == "Current Affairs"&& (this.blogs.description == null || this.blogs.description == ""|| this.blogs.image == "") ) || (this.blogs.type == "Video" &&(this.blogs.fileName == null || this.blogs.fileName == ""))) {
      this.notify.info("Please fill the required fields")
    }
    else if (this.blogs.type == "Daily Quiz" &&  this.inavlidQuesData==true ){
      this.notify.error("Please Provide Valid Question")
    }
    else if (this.blogs.type == "Daily Quiz") {
      if (this.blogs.title == null || this.blogs.subjectId == 0 || this.blogs.uploadQuestionFile == null || this.blogs.duration == null) {
        this.notify.info("Please fill the required fields")
      }
      else {
        this._apiService.loading.next(true);
        //this.blogs.fileName = this.imageFile;
        this.blogs.image = this.imageFile;
        this.createblogsDto.blogs = this.blogs;
        this.createblogsDto.blogs.lastModificationTime = this.blogs.lastModificationTime;
        if (this.createblogsDto.blogs.type != "Daily Quiz") {
          this.createblogsDto.questionIndex = [];
        }
        if (this.allQuestions != null) {
          this.allQuestions.forEach(element => {
            element.subjectId = this.blogs.subjectId;
          });
          this.questionservice.createQuestions(this.allQuestions).subscribe(res => {
          this.createblogsDto.questionIndex = res;
            this._blogsService.createBlogs(this.createblogsDto).subscribe(res => {
              this.notify.info(this.l('SavedSuccessfully'));
              this._apiService.loading.next(false);
              this.onSave.emit();
              this.router.navigate(['/app/blogs']);
            })
          });
        }
      }
    } 
    else {
      this._apiService.loading.next(true);
      //this.blogs.fileName = this.imageFile;
      this.blogs.image = this.imageFile;
      this.createblogsDto.blogs = this.blogs;
      this.createblogsDto.blogs.lastModificationTime = this.blogs.lastModificationTime
      if (this.createblogsDto.blogs.type != "Daily Quiz") {
        this.createblogsDto.questionIndex = [];
      }
      if (this.allQuestions != null) {
        this.allQuestions.forEach(element => {
          element.subjectId = this.blogs.subjectId;
        });
        this.questionservice.createQuestions(this.allQuestions).subscribe(res => {
          this.createblogsDto.questionIndex = res;
          this._blogsService.createBlogs(this.createblogsDto).subscribe(res => {
            this.notify.info(this.l('SavedSuccessfully'));
            this._apiService.loading.next(false);
            this.onSave.emit();
            this.router.navigate(['/app/blogs']);
          })
        });
      }
    }
  }

  checkInvalidQuestions(){
      var invalidQuestion = this.allQuestions.filter(a=>a.answer==null || a.answer=='' || a.answer==null || a.answer==''||a.option1==null || a.option1==''||a.option2==null || a.option2==''||a.option3==null || a.option3==''||a.option4==null || a.option4==''||a.explanations==null || a.explanations=='' )
      if(invalidQuestion!=null && invalidQuestion.length!=0){
        this.inavlidQuesData=true;
        invalidQuestion.forEach(element =>{
          var index = this.allQuestions.indexOf(element)
         this.invalidQuestionIndex.push(index)
        });
       
      }
  }
  cancel() {
    this.common.questionsIds = [];
    this.router.navigate(['/app/blogs']);
  }

  manageQuestions() {
    this.common.craeteBlog = cloneDeep(this.blogs);
    localStorage.setItem('isCallFromCreateBlog', 'true')
    this.router.navigate(['/app/question'])
  }


  onQuestionFileUpload(file) {
    if (file) {
      this.loading = true
      file = {
        fileName: file[0].name,
        data: file[0]
      };
      this.blogs.uploadQuestionFile = file.fileName;
      this.questionService.previewQuestion(file).subscribe((res) =>{
        this.allQuestions = res.filter(x=>x.questions!=null)
        this.loading = false;
        this.checkInvalidQuestions();
      
        if( this.allQuestions.length >10){
          this.lazyLoader(this.allQuestions)
        }
        else{
          this.questions =res.filter(x=>x.questions!=null);
          this.isQuestionLoading = true;
        }
      },(err)=>{
        this.loading = false;
      })
       
    }
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


  previewSelectedQuestions() {
    this.questionService.getQuestionList(this.common.questionsIds).subscribe(res => {
      this.questions = res;
    })
  }

  onUpload(file) {
    if (file) {
      this.loading = true;
      this.isImageUpladedStatus = "start";
      file = {
        fileName: file[0].name,
        data: file[0],
      };
    }
    this.commonService.uploadImage(file).subscribe((res) => {
      this.loading = false;
      this.isImageUpladedStatus = "end";
      this.blogs.image = res.showLink;
      // this.blogs.fileName = res.showLink;
      this.imageFile = res.saveLink;
    },(err)=>{
      this.loading=false;
    });
  }
}
