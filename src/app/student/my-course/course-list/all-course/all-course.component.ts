import { Component, HostListener, Injector, OnInit } from "@angular/core";
import {
  CategoryAppServicesServiceProxy,
  CategoryDto,
  CourseManagementAppServicesServiceProxy,
  CourseManagementDto,
  EnrollCoursesDto,
  EnrollCoursesServiceProxy,
  PaymentDto,
  PaymentServiceProxy,
  SessionServiceProxy,
  StudentCoursesDto,
} from "@shared/service-proxies/service-proxies";
import { cloneDeep } from "lodash-es";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { AppSessionService } from "@shared/session/app-session.service";
import { CommonService } from "@shared/helpers/common.service";
import { BuyCourseComponent } from "../../buy-course/buy-course.component";
import { AppComponentBase } from "@shared/app-component-base";
import { StartfreeTrialComponent } from "@app/student/startfree-trial/startfree-trial.component";
declare var Razorpay: any;
@Component({
  selector: "app-all-course",
  templateUrl: "./all-course.component.html",
  styleUrls: ["./all-course.component.scss"],
})
export class AllCourseComponent extends AppComponentBase implements OnInit {
  options: any = {
    key: "rzp_test_Q5YDNhqCtC9GHn",
    amount: "",
    name: "Teacher vision",
    description: "",
  // image: "https://teachervision.s3.ap-south-1.amazonaws.com/202304250525490850_logo-white.png?X-Amz-Expires=3600&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASXJGATAT2STVKXKV/20230425/ap-south-1/s3/aws4_request&X-Amz-Date=20230425T052550Z&X-Amz-SignedHeaders=host&X-Amz-Signature=d4f379bb58ec2bdaa2d06edfb70837e21b5514658a39e914d6243e7e6acd4111",
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
  course: CourseManagementDto = new CourseManagementDto();
  studentCourse: StudentCoursesDto = new StudentCoursesDto();
  allCourses: any = [];
  allCoursesData: any = [];
  allCategory: any = [];
  allCourse: any = [];
  treeData: any;
  date = new Date();
  studentCourses: any = [];
  loading = false;
  courseId: any;
  studentId: any;
  studentInfo: any = [];
  price: any;
  enrollCourse: EnrollCoursesDto = new EnrollCoursesDto();
  paymentres: PaymentDto = new PaymentDto();

  paymentId: string;
  error: string;
  selectedNode: any;
  name: string;
  notify: any;
  currentCourseId: any
  studentname: string;
  validDate = moment(new Date()).add("1", "years").format("YYYY-MM-DD");
  email: any;
  constructor(
    injector: Injector,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _enrollCourseService: EnrollCoursesServiceProxy,
    private _sessionService: SessionServiceProxy,
    private _modalService: BsModalService,
    private _categoryService: CategoryAppServicesServiceProxy,
    public route: ActivatedRoute,
    public router: Router,
    private commonService: CommonService,
    private _paymentService: PaymentServiceProxy,
    public bsModalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
    var navContent = { title: "Courses", lengthh: "-1" };
    this.commonService.pageTitle.next(navContent);
    this.course.categoryId = -1;
    //this.getAllVideoAndHybridCourse();
    this.getAllCourses(this.course.categoryId);
    this.getStudent();
    this.getAllCategories();
    this.getidFromRoute();
  }

  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.studentId = res.user.id;
      this.studentInfo = res.user;
      this.studentname = res.user.name;
      this.email = res.user.emailAddress;
    });
  }

  getAllCourses(categoryId: any) {
    this.loading = true;
    this._courseService
      .getAllDataBasedOnCategory(categoryId, "videoHybrid")
      .subscribe((res) => {
        this.allCourses = res;
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
  }
  getidFromRoute() {
    this.route.params.subscribe((params) => {
    });
  }
  getCourseDetails(id: any) {
    this._courseService.get(id).subscribe((res) => {
      this.price = res.price * 100;
      this.paynow(id);
    });
  }
  getAllCategories() {
    this._categoryService.getAll("", 0, 100).subscribe((res) => {
      this.allCategory = res.items;
      this.getParentChildData();
    });
  }

  getParentChildData() {
    var selectAllCategory = new CategoryDto();
    (selectAllCategory.id = -1),
      (selectAllCategory.categoryName = "Show All Category");
    this.allCategory.unshift(selectAllCategory);
    this.treeData = cloneDeep(
      this.allCategory.filter((x) => x.parentId == null)
    );
    this.treeData.forEach((element) => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      element["children"] = this.allCategory.filter(
        (x) => x.parentId == element.id
      );
      this.getChildrenData(element["children"]);
    });
  }
  getChildrenData(data) {
    data.forEach((element) => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      if (element.linkedId != -1) {
        element["children"] = this.childrenTree(element.id);
      }
    });
  }
  childrenTree(id) {
    var children = this.allCategory.filter((c) => c.parentId == id);
    children.forEach((element) => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      if (element.linkedId != -1) {
        element["children"] = this.childrenTree(element.id);
      }
    });
    return children;
  }

  paynow(id: any) {
    // this.loading=true;
    this._courseService.get(id).subscribe((res) => {
      this.course = res;
    });
    this.courseId = id;
    this.paymentId = "";
    this.error = "";
    this.options.amount = this.price; //paise
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
 
 navigateToBuyCourse(id: any) {
    this.router.navigateByUrl(
      "/app/student/my-course/buy/" + id + "/mock-test"
    );
  }

  save() {
    this.loading = true;
    this.enrollCourse.courseManagementId = this.courseId;
    this.enrollCourse.studentId = this.studentId;
    this.enrollCourse.valideUpto =  this.course.validateDuration;
    this._enrollCourseService
      .createEnrollCourse(this.enrollCourse)
      .subscribe((res) => {
        this.loading = false;
        this.notify.success("Purchased Successfully");
        //this.location.go("app/student/my-course/my-course")
        window.location.reload();
      },(err)=>{
        this.loading=false;
      });
  }

  onclick(id: any) {
    this.router.navigateByUrl("/app/student/my-course/view/" + id + "/notes");
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
