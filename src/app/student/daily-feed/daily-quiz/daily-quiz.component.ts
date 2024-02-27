import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewBlogResultComponent } from '@app/student/daily-quiz-test/view-blog-result/view-blog-result.component';
import { AppComponentBase } from '@shared/app-component-base';
import { BlogAppServicesServiceProxy, BlogResultDto, BlogResultServiceProxy, BlogsDto, CreateBlogsDto, QuestionBlogAppSeviceServiceProxy, QuestionBlogDto, SubjectServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { time } from 'console';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-daily-quiz',
  templateUrl: './daily-quiz.component.html',
  styleUrls: ['./daily-quiz.component.scss']
})
export class DailyQuizComponent extends AppComponentBase implements OnInit {
  dailyQuiz: BlogsDto = new BlogsDto();
  blogResult: BlogResultDto = new BlogResultDto();
  createdQues: CreateBlogsDto = new CreateBlogsDto();
  blogQuestionDto: QuestionBlogDto;
  quizQuestions: any = [];
  blogsQuestions: any = [];
  id: any;
  subjectId = 0;
  allSubjects: any = [];
  loading = false;
  public isResulted: any = []
  isViewExplanation: any = [false];
  blogData: BlogsDto[];
  // blogQuestions: import("d:/Jatin Verma/LMS Project/LMS-Frontend/angular/src/shared/service-proxies/service-proxies").QuestionDto[];
  constructor(injector: Injector, private _blogAppService: BlogAppServicesServiceProxy,
    private _subjectService: SubjectServiceServiceProxy,
    private _blogsQuestionsService: QuestionBlogAppSeviceServiceProxy,
    private _blogResultService: BlogResultServiceProxy,
    private router: Router,
    private _modalService: BsModalService) {
    super(injector)
  }

  ngOnInit(): void {
    this.getBlogResult();
    this.dailyQuiz.subjectId = 0;
   // this.getAllBlogQuestions();
    this.getSubjects();
    this.getAllBlogs();
  }


  getAllBlogs() {

    this.loading = true;
    this._blogAppService.getAllBlogs(this.subjectId).subscribe(res => {
      this.blogData = res.filter(a => a.type == "Daily Quiz");;
      this.blogData.forEach(element => {
        this._blogResultService.getBlogResult(element.id).subscribe(res => {
          if (res.blogId) {
            element.isResulted = true;
            this.loading = false;
          }
        },(err)=>{
          this.loading=false;
        });
      })
    })
  }

  startDailyQuizTest(id: number) {
    this.router.navigate(['app/student/daily-quiz-test/' + id])
  }

  getBlogResult() {
    this._blogResultService.getBlogResult(this.id).subscribe(res => {
      this.blogResult = res;
    })
  }

  getSubjects() {
    this.loading = true;
    this._subjectService.getAll("", 0, 100).subscribe(res => {
      this.allSubjects = res.items;
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
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

  checkAnswer(event, data, i) {
    this.isViewExplanation[i] = false;
    if (event.currentTarget.checked) {
      data.question["isAnswer"] = event.currentTarget.checked;
      data.question.userAnswer = event.currentTarget.value
    }
    else {
      data.question["isAnswer"] = false;
      data.question.userAnswer = null;
    }
  }
  viewExplanation(value, index: number) {
    if (value == true) {
      this.isViewExplanation[index] = true;
    }
    else {
      this.isViewExplanation[index] = false;
    }
  }
  back() {
    this.router.navigate(['/app/student/dashboard'])

  }


}
