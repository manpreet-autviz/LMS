import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogResultDto, BlogResultServiceProxy, MockTestUserAnsDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { cloneDeep } from "lodash-es";
@Component({
  selector: 'app-view-blog-result',
  templateUrl: './view-blog-result.component.html',
  styleUrls: ['./view-blog-result.component.scss']
})
export class ViewBlogResultComponent implements OnInit {

  id: any
  blogTestResult: BlogResultDto = new BlogResultDto();
  blogId: any;
  result: any = [];
  allQuestions: any = [];
  isFinish: boolean;
  index = 0;
  isResulted: boolean = false;
  currentQuestion: MockTestUserAnsDto;

  constructor(private router: Router, private activatesRoute: ActivatedRoute, private _modalService: BsModalService, private _blogtestResultService: BlogResultServiceProxy, public bsModalRef: BsModalRef) { }

  ngOnInit(): void {

    this.getBlogTestResult();
  }
  getBlogTestResult() {

    this._blogtestResultService.getBlogResult(this.id).subscribe(res => {
      this.blogTestResult = res;
      var attemptedQues = this.blogTestResult.attempted
      var correctAns = this.blogTestResult.correct
      var wrongAns = attemptedQues - correctAns;
      this.blogTestResult.wrong = wrongAns;
      this.blogTestResult.score = correctAns;

    })
  }

  cancel() {
    this.bsModalRef.hide();
  }

  viewBlogResult(blogId: number) {

    this.bsModalRef.hide();
    this.router.navigate(['app/student/daily-quiz-explnation/' + this.id + '/' + 'true'])
  }



}
