import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { EnrollMockTestDto, EnrollMockTestServiceProxy, MockTestDto, MockTestServiceProxy, MockTestUserAnsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralInstruction2Component } from '../general-instruction2/general-instruction2.component';

@Component({
  selector: 'app-general-instructions',
  templateUrl: './general-instructions.component.html',
  styleUrls: ['./general-instructions.component.scss']
})
export class GeneralInstructionsComponent extends AppComponentBase implements OnInit {
  id: any;
  courseManagementId:any;
  enrollmock: EnrollMockTestDto = new EnrollMockTestDto();
  mockTest: MockTestDto = new MockTestDto();
  mock: any = [];
  sectionData: any;
  title: string;
  
  constructor(injector: Injector,
    private _enrollMockService: EnrollMockTestServiceProxy,
    private _mockTestService: MockTestServiceProxy,
    private _mockTestUserAnsService: MockTestUserAnsServiceProxy,
    private route: ActivatedRoute,
    public router: Router,
    public commonService:CommonService,
    private _modalService: BsModalService
    
  ) { super(injector) }

  ngOnInit(): void {
    var navContent = { title: "General Instruction", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
    this.route.params.subscribe(params => {
      this.id = params.id;
    });
    this.getEnrolledMockTest();
  }

  getEnrolledMockTest(){
    this._enrollMockService.get(this.id).subscribe(res=>{
      this.enrollmock=res;
      this.getMock();
    })
  }

  back(){
 
    if (this.mockTest.isFree) {
      this.router.navigateByUrl(
        "/app/student/my-course/buy/" + this.enrollmock.courseManagementId + "/mock-test"
      );
    } else {
      this.router.navigateByUrl(
        "/app/student/my-course/view/" + this.enrollmock.courseManagementId + "/mock-test"
      );
   
  }
}
  getMock(){
    this._mockTestService.get(this.enrollmock.mockTestId).subscribe(res=>{
      this.mockTest=res;
      this.title=res.title;
    })
  }

  // back(){
  //   this.router.navigate(["app/student/my-course/view/" + this.id + "/mock-test"] );
  // }
  start() {
    this._mockTestService.getMockTestSection(this.enrollmock.mockTestId).subscribe(res => {
      this.sectionData = res;

      if (this.enrollmock.isView) {
        abp.message.confirm(
          this.l("If you select Yes It will resume the test otherwise If you select Cancel it will  start again"),
          this.l("Do you want to Resume the  mocktest...!!"),
          (result: boolean) => {
            if (result) {
              localStorage.removeItem('tab')
              this.router.navigate(['app/student/mock-test/' + this.enrollmock.mockTestId])
            }
            else {
              this.reattempt(this.enrollmock.mockTestId)
            }
          }
        );
      }
      else {
        this._mockTestUserAnsService.createUserMockTestAllSection(this.sectionData).subscribe();
        this._enrollMockService.markIsView(this.id).subscribe(res => {
          this.router.navigate(['app/student/mock-test/' + this.enrollmock.mockTestId])
        })
      }
    })
  }

  reattempt(id:number){
    localStorage.removeItem('tab')
    this.router.navigate(['app/student/mock-test/'+ id+'/true'])
  }
  
  showReattemptMessage(mockTestId: any) {
    abp.message.confirm(
      this.l("Do you want to reattempt this mocktest...!!"),
      undefined,
      (result: boolean) => {
     
        if (result) {
         this.reattempt(mockTestId)
        }
      }
    );
  }
  openGeneralInstruction() {
    let addQuestion: BsModalRef;
    addQuestion = this._modalService.show(
      GeneralInstruction2Component,
      {
        backdrop: 'static',
        keyboard: false,
        class: 'modal-xl  modal-dialog-centered',
        initialState: {
          quest: this.enrollmock.id,
        },
      }
      
    );

    
    // addQuestion.content.onSave.subscribe((res: any) => {
    //   if (res.allQuestions.length > 0 || res.items.length > 0) {
    //     if (res.questions.length > 0) {
    //       this.isQuestionAdded = true;
    //       this.addQuestions = res.questions;
    //     }
    //     this.createmockTestDto.mockTestSection = res.items;
    //     this.bindData = res.allQuestions
    //     res.allQuestions.forEach(element => {
    //       this.questions = this.questions.concat(element)
    //     });
    //   }
    // });
  }
}
