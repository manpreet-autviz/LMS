import { Component, HostListener, Injector, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MockTestComponent } from "@app/student/mock-test/mock-test.component";
import { ViewResultComponent } from "@app/student/mock-test/view-result/view-result.component";
import { AppComponentBase } from "@shared/app-component-base";
import {
  CourseManagementAppServicesServiceProxy,
  CourseManagementDto,
  EnrollCoursesDto,
  EnrollCoursesServiceProxy,
  EnrollMockTestDto,
  EnrollMockTestServiceProxy,
  MockTestDto,
  MockTestServiceProxy,
  PaymentDto,
  PaymentServiceProxy,
  SessionServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { cloneDeep } from "lodash-es";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Location } from "@angular/common";
import * as moment from "moment";
import { StartfreeTrialComponent } from "@app/student/startfree-trial/startfree-trial.component";
declare var Razorpay: any;
@Component({
  selector: "app-upcoming",
  templateUrl: "./upcoming.component.html",
  styleUrls: ["./upcoming.component.scss"],
})
export class UpcomingComponent extends AppComponentBase implements OnInit {
  mockTest: MockTestDto = new MockTestDto();
  enrollMock: any = new EnrollMockTestDto();
  paymentres: PaymentDto = new PaymentDto();
  course: CourseManagementDto = new CourseManagementDto();
  enrollCourse: EnrollCoursesDto = new EnrollCoursesDto();
  allMockTest: any = [];
  allCourses: any = [];
  id: any;
  courseId: any;
  mocktestId: any;
  studentId: any;
  loading = false;
  price: any;
  filterSubjectIds = [];
  filterTopicIds = [];
  mockTestData:any;
  enrollmocktest: EnrollMockTestDto = new EnrollMockTestDto();
  options: any = {
    key: "rzp_test_Q5YDNhqCtC9GHn",
    amount: "",
    name: "Teacher vision",
    description: "",
    // image: "../assets/img/logo.white.png",
    order_id: "",
    handler: function (response: any) {
      var event = new CustomEvent("payment.success", {
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
  paymentId: string;
  error: string;
  email: any;
  name: any;
  mocktestData:any;
  validDate = moment(new Date()).add("1", "years").format("YYYY-MM-DD");

  constructor(
    injector: Injector,
    private router: Router,
    private _sessionService: SessionServiceProxy,
    private _modalService: BsModalService,
    private _enrollMockService: EnrollMockTestServiceProxy,
    private _enrollCourseService: EnrollCoursesServiceProxy,
    private _mocktestService: MockTestServiceProxy,
    private _paymentService: PaymentServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private location: Location
  ) {
    super(injector);
  }

  ngOnInit(): void {
    //this.getMockTests();
    this.course.categoryId = -1;
    this.getAllCourses(this.course.categoryId);
    this.getStudent();
  }

  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.studentId = res.user.id;
      this.email = res.user.emailAddress;
      this.name = res.user.name;
    });
  }

  getAllCourses(categoryId: any) {
    this.loading = true;
    this._courseService
      .getAllDataBasedOnCategory(categoryId, "Mock")
      .subscribe((res) => {
        this.allCourses = res;
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
  }
  navigateToBuyCourse(id: any) {
    this.router.navigateByUrl(
      "/app/student/my-course/buy/" + id + "/mock-test"
    );
  }

  onclick(id: any) {
    this.router.navigateByUrl("/app/student/my-course/view/" + id + "/notes");
  }
  getMockDetails(id: any) {
    this._courseService.get(id).subscribe((res) => {
      this.price = res.price * 100;
      this.paynow(id);
    });
  }
  paynow(id: any) {
    this._courseService.get(id).subscribe((res) => {
      this.course = res;
    });
    this.courseId = id;
    this.paymentId = "";
    this.error = "";
    this.options.amount = this.price;
    this.options.mockTest = "";
    this.options.prefill.name = "";
    this.options.prefill.email = this.email;
    this.options.prefill.contact = "";
    var rzp1 = new Razorpay(this.options);
    rzp1.open();
    rzp1.on("payment.failed", (response: any) => {
      this.paymentres.transactionID = response.error.metadata.payment_id
      this.paymentres.paymentStatus = 'Failed';
      this.paymentres.courseManagementId = this.courseId;
      this.paymentres.name = this.name;
      this.paymentres.price = this.course.price;
      this.paymentres.date = this.course.creationTime;
      this.paymentres.paymentType = "Online";
      this.paymentres.purchaseTitle = this.course.name;
      this.paymentres.courseDescription = this.course.detail;
      this.paymentres.emailAddress = this.email ;  
      this._paymentService.createPayment(this.paymentres).subscribe();
      this.notify.error("Payment Failed");
    });
  }
 
  save() {
    this.loading = true;
    this._courseService.getStudentCourse(this.courseId).subscribe((res) => {
    
      this.enrollCourse.courseManagementId = this.courseId;
      this.enrollCourse.studentId = this.studentId;
      this.enrollCourse.valideUpto =  this.course.validateDuration;
      this._enrollCourseService
        .createEnrollCourse(this.enrollCourse)
        .subscribe((res) => {
          this.notify.success("Purchased Succesfully");
          this.location.go("app/student/mock/my-mock");
          this.loading = false;
          window.location.reload();
        });
    },(err)=>{
      this.loading=false;
    });
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
