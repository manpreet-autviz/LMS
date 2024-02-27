import { Component, HostListener, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { CommonService } from "@shared/helpers/common.service";
import {
  CourseManagementAppServicesServiceProxy,
  CourseManagementDto,
  EnrollCoursesDto,
  EnrollCoursesServiceProxy,
  EnrollMockTestDto,
  EnrollMockTestServiceProxy,
  PaymentDto,
  PaymentServiceProxy,
  SessionServiceProxy,
  StudentCoursesDto,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Location } from "@angular/common";
import { error } from "console";
import { throwError } from "rxjs";
import { map } from "rxjs/operators";

declare var Razorpay: any;

@Component({
  selector: "app-buy-course",
  templateUrl: "./buy-course.component.html",
  styleUrls: ["./buy-course.component.scss"],
})
export class BuyCourseComponent extends AppComponentBase implements OnInit {
  options: any = {
    key: "rzp_test_Q5YDNhqCtC9GHn",
    amount: "",
    name: "Teacher vision",
    description: "",
    // image: " ",
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

  selectedTab: string;
  course: CourseManagementDto = new CourseManagementDto();
  studentCourse: StudentCoursesDto = new StudentCoursesDto();
  enrollCourse: EnrollCoursesDto = new EnrollCoursesDto();
  enrollMock: any = new EnrollMockTestDto();

  enrolledMockTests: any = [];
  NewEnrolledMockTest: any = [];
  mockTestData: any;
  loading = false;
  id: any;
  allPayment: any = [];
  paymentres: PaymentDto = new PaymentDto();
  studentCourses: any = [];
  allCourses: any = [];
  courseId: any;
  paymentId: string;
  error: string;
  price: any;
  studentInfo: any;
  studentId: number;
  freeVideos: any[];
  freeMock: any[];
  name: string;
  studentname: string;
  paymentType: string;
  activeTab: any;
  mocktestData: any;
  email: any;
  constructor(
    injector: Injector,
    private common: CommonService,
    public router: Router,
    private _enrollCourseService: EnrollCoursesServiceProxy,
    private location: Location,
    private _enrollMock: EnrollMockTestServiceProxy,
    private _sessionService: SessionServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private route: ActivatedRoute,
    public bsModalRef: BsModalRef,
    private _paymentService: PaymentServiceProxy
  ) {
    super(injector);
  }

  ngAfterViewInit(): void {

    this.route.params.subscribe((params) => {
      this.activeTab = params.tab;
      var that = this;
      setTimeout(function () {
        document.getElementById(that.activeTab + "-link").click();
      }, 2000);
    });
  }
  ngOnInit(): void {
    var navContent = { title: "My Course Details", lengthh: "-1" };

    this.common.pageTitle.next(navContent);
    this.getidFromRoute();
    this.getStudent();

    // this.getallPaymenthistory();
    //this.getAllCourses(this.allCourses.categoryId)
  }
  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.studentId = res.user.id;
      this.studentInfo = res.user;
      this.studentname = res.user.name;
      this.email = res.user.emailAddress
      //this.paymentType=res.payment
    });
  }
  getidFromRoute() {
    this.route.params.subscribe((params) => {
      let name = params["id"];

      this.courseId = params["id"];
      this.activeTab = params.tab;
      //name = name.split('/');
      this.getCourseDetail(name);
    });
  }
  getEnrolledMockTestsData(name) {
    this._enrollMock
      .getEnrolledMockTestByUserIdAndCourseId(this.studentId, name)
      .subscribe((res) => {
        this.enrolledMockTests = res;
      });
  }

  getCourseDetail(name) {
    this.loading = true;
    this._courseService.getStudentCourse(name).subscribe((res) => {
      this.studentCourse = res;
      this.freeVideos = res.videos.filter((res) => res.isFree == true);
      this._sessionService.getCurrentLoginInformations().subscribe((res) => {
        this.studentId = res.user.id;
        this.studentInfo = res.user;
        this.studentname = res.user.name;

        this.getEnrolledMockTestsData(name);
      });
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  getCourseDetails(id: any) {
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
      this.paymentres.emailAddress = this.studentInfo.emailAddress;
      this._paymentService.createPayment(this.paymentres).subscribe();
      this.notify.error("Payment Failed");
    });

  }
  @HostListener("window:Success", ["$event"])
  onPaymentSuccess(event: any): void {

    this.paymentres.transactionID = event.detail.razorpay_payment_id;
    this.paymentres.paymentStatus = event.type;
    this.paymentres.courseManagementId = this.courseId;
    this.paymentres.name = this.studentname;
    this.paymentres.price = this.course.price;
    this.paymentres.date = this.course.creationTime;
    this.paymentres.paymentType = "Online";
    this.paymentres.purchaseTitle = this.course.name;
     this.paymentres.courseDescription = this.course.detail;
      this.paymentres.emailAddress = this.studentInfo.emailAddress;
    this._paymentService.createPayment(this.paymentres).subscribe();
    this.save();
  }

  navigateToAllCourses(id: any) {
    this.router.navigateByUrl("/app/student/mock/upcoming");
  }
  back() {
    if (this.studentCourse.type == "Mock") {
      this.router.navigate(['app/student/mock/upcoming'])
    }
    else {
      this.router.navigate(['app/student/my-course/list/all-course'])
    }
  }
  save() {
    this.loading = true;
    this.enrollCourse.courseManagementId = this.courseId;
    this.enrollCourse.studentId = this.studentId;
    this.enrollCourse.valideUpto =  this.course.validateDuration;
    this._enrollCourseService
      .createEnrollCourse(this.enrollCourse)
      .subscribe(res => {
        this.loading = false;
        this.notify.success("Purchased Succesfully");
        this.router.navigate(["app/student/my-course/view/" + this.courseId + "/mock-test"])

      },(err)=>{
        this.loading=false;
      });
  }

  getVideoId(url) {
    var id = "";
    if (Boolean(url) && url.includes('v=')) {
      id = url.split("v=")[1];
      if (id != null) {
        return id.includes("&") ? id.split("&")[0] : id;
      }
    }
    else {
      var arrayUrl = url.split('/')
      if (arrayUrl.length > 3) {
        id = arrayUrl[arrayUrl.length - 1].split('?')[0]
      }
      else {
        id = arrayUrl[arrayUrl.length - 1];
      }
    }
    return id;
  }

  showVideo(id: number) {
    this.router.navigate(["app/student/student-live/" + id]);
  }

  checkActive(tab) {
    if (tab == "mock-test") {
      this.location.go(
        "app/student/my-course/buy/" + this.courseId + "/mock-test"
      );
    } else if (tab == "notes") {
      this.location.go("app/student/my-course/buy/" + this.courseId + "/notes");
    } else if (tab == "videos") {
      this.location.go(
        "app/student/my-course/buy/" + this.courseId + "/videos"
      );
    } else {
      this.location.go("app/student/my-course/buy/" + this.courseId + "/quiz");
    }
  }

}
