import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MocktestResultDto, MockTestResultServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.component.html',
  styleUrls: ['./view-result.component.scss']
})
export class ViewResultComponent implements OnInit {
  id: any
  mockTestResult: MocktestResultDto = new MocktestResultDto();
  result: any = [];

  constructor(private router: Router, private activatesRoute: ActivatedRoute, private _modalService: BsModalService, private _mocktestResultService: MockTestResultServiceServiceProxy, public bsModalRef: BsModalRef) { }

  ngOnInit(): void {

    this.getMockTestResult();
  }
  getMockTestResult() {
    this._mocktestResultService.getMockTestResult(this.id).subscribe(res => {
      this.mockTestResult = res;

      var attemptedQues = this.mockTestResult.attempted
      var correctAns = this.mockTestResult.correct
      var wrongAns = attemptedQues - correctAns;
      this.mockTestResult.wrong = wrongAns;
      if (this.mockTestResult.mockTest.isNegativeMarking) {
        var score = (correctAns * this.mockTestResult.mockTest.eachQuestionNumber) - (wrongAns * this.mockTestResult.mockTest.eachQuestionNegativeMarking);
        this.mockTestResult.score = score;
      }
      else {
        score = (correctAns * this.mockTestResult.mockTest.eachQuestionNumber);
        this.mockTestResult.score = score;
      }

    })
  }

  viewMockTestResult(id: number) {
    this.bsModalRef.hide();
    window.close();
    // this.router.navigate(['app/student/mock-test-explnation/ ' + this.id + '/' + 'true'])
    var newWindow =  window.open('/#/app/student/mock-test-explnation/'+ this.id + '/true', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width='+screen.width+',height='+screen.height);
   
    newWindow.focus();
  }

  cancel() {
    this.bsModalRef.hide();
    window.close();
  }
}
