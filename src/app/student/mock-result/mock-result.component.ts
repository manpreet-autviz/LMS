import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MocktestResultDto, MockTestResultServiceServiceProxy, MockTestUserAnsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-mock-result',
  templateUrl: './mock-result.component.html',
  styleUrls: ['./mock-result.component.scss']
})
export class MockResultComponent implements OnInit {
  id: number
  allAnswers: any = [];
  allMockTestAns: MocktestResultDto;
  constructor(private activatedRoute: ActivatedRoute, private _mockTestAns: MockTestUserAnsServiceProxy,private _mockTestResult : MockTestResultServiceServiceProxy) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
      this.getResultById();
    });
  }
  getResultById() {
    this._mockTestResult.getResultById(this.id).subscribe(res => {
      this.allAnswers = res;

    })
  }
}