import { Component, HostListener, Injector, Input, OnInit } from '@angular/core';
import { checkNumber } from '@amcharts/amcharts4/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewResultComponent } from '@app/student/mock-test/view-result/view-result.component';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseManagementAppServicesServiceProxy, CourseManagementDto, EnrollCoursesDto, EnrollCoursesServiceProxy, EnrollMockTestDto, EnrollMockTestServiceProxy, MockTestServiceProxy, MockTestUserAnsServiceProxy, PaymentDto, PaymentServiceProxy, SessionServiceProxy, StudentCoursesDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StartfreeTrialComponent } from '@app/student/startfree-trial/startfree-trial.component';
declare var Razorpay: any;
@Component({
  selector: 'app-course-questions',
  templateUrl: './course-questions.component.html',
  styleUrls: ['./course-questions.component.scss']
})
export class CourseQuestionsComponent extends AppComponentBase implements OnInit {
  options: any = {
    key: "rzp_test_Q5YDNhqCtC9GHn",
    amount: "",
    name: "Teacher vision",
    description: "",
    // image: "",
    order_id: "",
    handler: function (response: any) {
      var event = new CustomEvent("Success", {
        detail: response,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);
    },
    prefill: {
      name: "",
      email: "",
      contact: "",
    },
    notes: {
      address: "",
    },
    theme: {
      color: "#3399cc",
    },
  };

  mockTests: any[] = [];
  id: any;
  price: any;
  isFree: boolean;
  isBuy: boolean;
  courseId: any;
  studentInfo: any;
  paymentId: string;
  error: string;
  loading = false;
  studentId: any;
  Resume: boolean;
  currentCourseId: any
  studentname: string;
  sectionData: any;

  enrollCourse: EnrollCoursesDto = new EnrollCoursesDto();
  paymentres: PaymentDto = new PaymentDto();
  course: CourseManagementDto = new CourseManagementDto();
  studentCourse: StudentCoursesDto = new StudentCoursesDto();
  NewEnrolledMockTest: any = [];
  enrollMock: any = new EnrollMockTestDto();
  @Input() mockTestProps: any[];
  RemovedMockTest: any;
  constructor(public router: Router, injector: Injector,
    private _mockTestService: MockTestServiceProxy,
    private _mockTestUserAnsService: MockTestUserAnsServiceProxy,
    private _paymentService: PaymentServiceProxy,
    private _sessionService: SessionServiceProxy, private _enrollMock: EnrollMockTestServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _modalService: BsModalService, private _enrollCourseService: EnrollCoursesServiceProxy,
    private route: ActivatedRoute) {
    super(injector)
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mockTests = this.mockTestProps;
    },);

  }
  ngOnInit(): void {

    this.route.params.subscribe(params => {
      let id = params['id'];
      this.id = params['id']
      this.getStudent();
    });
    // this.getCourseDetail(this.id)
  }

  back() {
    this.router.navigate(['app/student/my-course/list/all-course'])
  }

  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe(res => {
      this.studentId = res.user.id;
      this.studentInfo = res.user;
      this.studentname = res.user.name;
      this.getCourseDetail();

    })
  }
  getEnrollMockTest() {
    this._enrollMock.getEnrolledMockTestByUserIdAndCourseId(this.studentId, this.id).subscribe(res => {
      this.mockTests = res;
      this.NewEnrolledMockTest = this.studentCourse?.mockTests?.filter(item => !this.mockTests.some(_item => _item.mockTestId === item.id));
      if (this.NewEnrolledMockTest != null && this.NewEnrolledMockTest.length > 0) {
        this.mockTests = [...this.mockTests, this.NewEnrolledMockTest]
      }

      this.RemovedMockTest = this.mockTests.filter(item => !this.studentCourse.mockTests.some(_item => _item.id == item.mockTestId))

      if (this.RemovedMockTest != null && this.RemovedMockTest.length > 0) {
        this.RemovedMockTest.forEach((element => this._enrollMock.deleteEnrollMockTest(element.id).subscribe())
        );
        this.getCourseDetail();
      }
      if (this.NewEnrolledMockTest != null && this.NewEnrolledMockTest.length > 0) {
        this.NewEnrolledMockTest.forEach((element) => {
          this.enrollMock.mockTestId = element.id;
          this.enrollMock.studentId = this.studentId;
          this.enrollMock.courseManagementId = this.id;
          this._enrollMock.createCourseMockTest(this.enrollMock).subscribe();
        });
      }
    })
  }

  getCourseDetail() {
    this._courseService.getStudentCourse(this.id).subscribe(res => {
      this.studentCourse = res;
      this.getEnrollMockTest();
    })
  }

  showInstruction(id: number, item?) {
    this.router.navigate(['app/student/general-instructions/' + id])

  }
  start(id: number, item?) {

    this._mockTestService.getMockTestSection(id).subscribe(res => {
      this.sectionData = res;

      if (item.isView) {
        abp.message.confirm(
          this.l("If you select Yes It will resume the test otherwise If you select Cancel it will  start again"),
          this.l("Do you want to Resume the  mocktest...!!"),
          (result: boolean) => {
            if (result) {
              localStorage.removeItem('tab')
              this.router.navigate(['app/student/mock-test/' + id])
            }
            else {
              this.reattempt(id)
            }
          }
        );
      }
      else {
        this._mockTestUserAnsService.createUserMockTestAllSection(this.sectionData).subscribe();
        this._enrollMock.markIsView(item.id).subscribe(res => {
          this.router.navigate(['app/student/mock-test/' + id])
        })
      }
    })
  }
  reattempt(id: number) {
    localStorage.removeItem('tab')
    this.router.navigate(['app/student/mock-test/' + id + '/true'])
  }

  showReattemptMessage(id: any) {
    abp.message.confirm(
      this.l("Do you want to reattempt this mocktest...!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this.router.navigate(['app/student/general-instructions/' + id])

        }
      }
    );
  }

  viewResult(id: number): void {

    let createOrEditTenantDialog: BsModalRef;
    if (id) {
      createOrEditTenantDialog = this._modalService.show(
        ViewResultComponent,
        {
          class: 'modal-lg modal-dialog-centered',
          initialState: {
            id: id,
          }
        }
      );
    }
  }
  paynow(id: any) {
    this._courseService.get(id).subscribe((res) => {
      this.course = res;

    });
    this.courseId = id;
    this.paymentId = "";
    this.error = "";
    this.options.amount = this.price; //paise
    this.options.course = "";
    this.options.prefill.name = this.studentInfo.name;
    this.options.prefill.email = this.studentInfo.emailAddress;
    this.options.prefill.contact = "";
    var rzp1 = new Razorpay(this.options);
    rzp1.open();
    rzp1.on("payment.failed", (response: any) => {

      this.paymentres.transactionID = response.error.metadata.payment_id
      this.paymentres.paymentStatus = 'Failed';
      this.paymentres.courseManagementId = this.courseId;
      this.paymentres.name = this.studentname;
      this.paymentres.price = this.course.price;
      this.paymentres.date = this.course.creationTime;
      this.paymentres.paymentType = "Online";
      this.paymentres.purchaseTitle = this.course.name;
      this.paymentres.courseDescription = this.course.detail;
      this.paymentres.emailAddress = this.studentInfo.emailAddress ;
      this._paymentService.createPayment(this.paymentres).subscribe();
      this.notify.error("Payment Failed");
    });
  }


  startcourse(id: any, enrollMockId) {
    if (!this.isFree) {
      this._courseService.get(id).subscribe((res) => {
        this.price = res.price * 100;
        this.paynow(id)

      });
    }
  }

  startFreeTrialCourse(id: number): void {
    let createOrEditTenantDialog: BsModalRef;
    if (id) {
      createOrEditTenantDialog = this._modalService.show(StartfreeTrialComponent, {
        class: "modal-dialog-centered",
        initialState: {
          id: id,
        },
      });
    }
  }
}

