import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { EnrollMockTestDto, EnrollMockTestServiceProxy, MockTestDto, MockTestServiceProxy, MockTestUserAnsServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-general-instruction2',
  templateUrl: './general-instruction2.component.html',
  styleUrls: ['./general-instruction2.component.scss']
})
export class GeneralInstruction2Component extends AppComponentBase implements OnInit {
  mockTest: MockTestDto = new MockTestDto();
  enrollmock: EnrollMockTestDto = new EnrollMockTestDto();
  id: any;
  quest: any
  sectionData: any;
  userId: any;
  mockTestSectionData: any;
  constructor(injector: Injector,
    private _enrollMockService: EnrollMockTestServiceProxy,
    private _mockTestService: MockTestServiceProxy,
    private route: ActivatedRoute,
    public router: Router,
    private _modalService: BsModalRef,
    private _mockTestUserAnsService: MockTestUserAnsServiceProxy,
    private sessionService: SessionServiceProxy) { super(injector) }

  ngOnInit(): void {
    localStorage.removeItem("isResume");
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.id = this.quest;
      this.getEnrolledMockTest();

    });

  }
  getUserMockSection() {
    this._mockTestUserAnsService.getUserMockTestSection(this.enrollmock.mockTestId, this.userId).subscribe(res => {
      this.mockTestSectionData = res;
    })
  }
  getEnrolledMockTest() {
    this._enrollMockService.get(this.quest).subscribe(res => {
      this.enrollmock = res;
      this.sessionService.getCurrentLoginInformations().subscribe(res => {
        this.userId = res.user.id;
        this.getUserMockSection();
      })
      this.getMockData();
    })
  }
  getMockData() {
    this._mockTestService.getMockTestData(this.enrollmock.mockTestId).subscribe(res => {
      this.mockTest = res;
    })
  }

  start() {
    this._modalService.hide()
    this._mockTestService.getMockTestSection(this.enrollmock.mockTestId).subscribe(res => {
      this.sectionData = res;

      if (this.enrollmock.isView) {
        abp.message.confirm(
          this.l("If you select Yes It will resume the test otherwise If you select Cancel it will start again"),
          this.l("Do you want to Resume the  mocktest...!!"),
          (result: boolean) => {
            if (result) {
              if (this.mockTestSectionData.length > 0) {
                localStorage.removeItem('tab');
                localStorage.setItem('isResume', 'true');
                var newWindow =  window.open('/#/app/student/mock-test/' + this.enrollmock.mockTestId, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width='+screen.width+',height='+screen.height);
                newWindow.focus();
               
              } else {
                this._mockTestUserAnsService.createUserMockTestAllSection(this.sectionData).subscribe(res => {
                  localStorage.removeItem('tab');
                  localStorage.setItem('isResume', 'true');
                  var newWindow = window.open('/#/app/student/mock-test/' + this.enrollmock.mockTestId, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width='+screen.width+',height='+screen.height);
                  newWindow.focus();
                });
              }
            } else {
              this.reattempt()
            }
           
          }
        );
      }
      else {
        this._mockTestUserAnsService.createUserMockTestAllSection(this.sectionData).subscribe(res => {
          this._enrollMockService.markIsView(this.id).subscribe(resp => {
            var newWindow =   window.open('/#/app/student/mock-test/' + this.enrollmock.mockTestId, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width='+screen.width+',height='+screen.height);
            newWindow.focus();
          })
        });

      }
    })
  }

  reattempt() {
    localStorage.removeItem('tab')
    if (this.enrollmock.isSubmitted == true) {
      this._enrollMockService.markIsSubmitted(this.enrollmock.id).subscribe();
    }
    if (this.mockTestSectionData.length > 0) {
      this.mockTestSectionData.forEach(element => {
        element.creationTime = moment();
        this._mockTestUserAnsService.updateUserMockTestSection(element).subscribe();
      });
      // this.router.navigate(['app/student/mock-test/' + this.enrollmock.mockTestId + '/true']);
    var newWindow =   window.open('/#/app/student/mock-test/'+ this.enrollmock.mockTestId + '/true', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width='+ window.outerWidth+',height='+ window.outerHeight); 
    newWindow.focus();
      this._modalService.hide();
    }
    else {
      this._mockTestUserAnsService.createUserMockTestAllSection(this.sectionData).subscribe(res => {
        // this.router.navigate(['app/student/mock-test/' + this.enrollmock.mockTestId + '/true']);
        var newWindow =    window.open('/#/app/student/mock-test/'+ this.enrollmock.mockTestId + '/true', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width='+ window.outerWidth+',height='+ window.outerHeight);
        newWindow.focus();

      });
    }

  }

  cancel() {
    this._modalService.hide();
  }

  showReattemptMessage(mockTestId: any) {
    abp.message.confirm(
      this.l("Do you want to reattempt this mocktest...!!"),
      undefined,
      (result: boolean) => {

        if (result) {
          this.reattempt()
        }
      }
    );
  }
}
