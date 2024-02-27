import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "@shared/helpers/common.service";
import {
  BlogAppServicesServiceProxy,
  BlogsDto,
  CategoryAppServicesServiceProxy,
  CategoryDto,
  ContentManagementServiceServiceProxy,
  ContentManagementVideosDto,
  CourseManagementAppServicesServiceProxy,
  CourseManagementDto,
  EnrollCoursesDto,
  EnrollCoursesServiceProxy,
  PaymentDto,
  PaymentServiceProxy,
  PromotionDto,
  PromotionServiceProxy,
  SessionServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { cloneDeep } from "lodash-es";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { StartfreeTrialComponent } from "../startfree-trial/startfree-trial.component";
declare var Razorpay: any;
import * as moment from "moment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { PlyrComponent } from "ngx-plyr";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @ViewChild(PlyrComponent, { static: true })
  options: any = {
    key: "rzp_test_Q5YDNhqCtC9GHn",
    amount: "",
    name: "Teacher vision",
    description: "",
    // image: "",
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
  loading = false;
  allCourses: any = [];
  videos: any = [];
  studentId: number;
  enrollCourse: EnrollCoursesDto = new EnrollCoursesDto();
  paymentres: PaymentDto = new PaymentDto();
  course: CourseManagementDto = new CourseManagementDto();
  promotion: PromotionDto = new PromotionDto();
  allMockCourse: any = [];
  allHybridCourse:any = []
  allVideoMockCourse: any = [];
  allCategory: any = [];
  treeData: any;
  selectedNode: any;
  selectedCategory: any;
  price: number;
  studentCourses: any = [];
  courseId: any;
  studentInfo: any = [];
  paymentId: string;
  error: string;
  name: string;
  notify: any;
  studentname: string;
  allpromotion: any = [];
  date = new Date();
  validDate = moment(new Date()).add("1", "years").format("YYYY-MM-DD");
  items: any = []
  email:any;
  blogDto : BlogsDto = new BlogsDto();
  plyrOptions = {
    controls: [
      'play-large', // The large play button in the center
      //'restart', // Restart playback
      'rewind', // Rewind by the seek time (default 10 seconds)
      'play', // Play/pause playback
      'fast-forward', // Fast forward by the seek time (default 10 seconds)
      'progress', // The progress bar and scrubber for playback and buffering
      'current-time', // The current time of playback
      'duration', // The full duration of the media
      'mute', // Toggle mute
      'volume', // Volume control
      //'captions', // Toggle captions
      'settings', // Settings menu
      //'pip', // Picture-in-picture (currently Safari only)
      //'airplay', // Airplay (currently Safari only)
      //'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
      'fullscreen' // Toggle fullscreen
    ]
  }
  constructor(
    private _courseService: CourseManagementAppServicesServiceProxy,
    public route: Router,
    private commonService: CommonService,
    private contentService: ContentManagementServiceServiceProxy,
    private _sessionService: SessionServiceProxy,
    private _enrollService: EnrollCoursesServiceProxy,
    private _categoryService: CategoryAppServicesServiceProxy,
    private _paymentService: PaymentServiceProxy,
    private _modalService: BsModalService,
    private _promotionservice: PromotionServiceProxy,
    private _blogAppService: BlogAppServicesServiceProxy,
    public sanitizer: DomSanitizer,
    public router: Router
  ) { }
  urlSafe: SafeResourceUrl;

  ngOnInit(): void {
   
    var navContent = { title: "Dashboard", lengthh: -1 };
    this.commonService.pageTitle.next(navContent);
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.blogDto.fileName)
    this.getAllVideos();
    this.getStudent();
    this.getmockCourse(this.course.categoryId);
    this.getAllCourseVIdeoMock(this.course.categoryId);
    this.getAllCourseHybridMock(this.course.categoryId)
    this.getpromotiondata();
    this.getAllCategories();
    this.getCategories();
  }
  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.studentId = res.user.id;
      this.studentInfo = res.user;
      this.studentname = res.user.name;
      this.email=res.user.emailAddress;
    
      this.getStudentCourses(this.studentId);
    });
  }

  getmockCourse(categoryId: any) {
    this.loading = true;
    this._courseService
      .getAllDataBasedOnCategory(categoryId, "Mock")
      .subscribe((res) => {
        this.allMockCourse = res.filter((res) => res.type == "Mock");
      
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
  }
  navigateallviewcourse() {
    this.route.navigate(["/app/student/my-course/list/all-course"]);
  }

  navigateallMockTest() {
    this.route.navigate(["/app/student/mock/upcoming"]);
  }

  getroute() {
    this.route.navigate(["/app/student/my-course/list/all-course"]);
  }

  getStudentCourses(studentId: any) {
    this.loading = true;
    this._enrollService.getAllEnrollCourses(studentId).subscribe((res) => {
      this.allCourses = res;
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }
  getAllCourseVIdeoMock(categoryId: any) {
    this.loading = true;
    this._courseService
      .getAllDataBasedOnCategory(categoryId, "Video")
      .subscribe((res) => {
        this.allVideoMockCourse = res
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
  }
  getAllCourseHybridMock(categoryId: any) {
    this.loading = true;
    this._courseService
      .getAllDataBasedOnCategory(categoryId, "Hybrid")
      .subscribe((res) => {
        this.allHybridCourse = res
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
  }

  // getAllVideos() {
  //   this.loading = true;
  //   this.contentService.getAllContentVideos().subscribe((res) => {
  //     this.videos = res;
  //     this.loading = false;
  //   });
  // } 
  getAllVideos() {
    this.loading = true;
    this._blogAppService.getAllBlogVideos().subscribe((res) => {
      this.videos = res;
     
      this.videos.forEach(element => {
        element["source"]= [{
          src: element.fileName,
          provider: 'youtube',
        }]
       });
       this.loading=false;
   },(err)=>{
    this.loading=false;
  });
    
  } 

  navigateToBuyCourse(id: any) {
    this.route.navigateByUrl("/app/student/my-course/buy/" + id + "/mock-test");
  }

  showVideo(id: number) {
    this.route.navigate(["app/student/student-live/" + id]);
  }

  getVideoId(url) {
    var id = "";
    if (Boolean(url) && url.includes('v=')) {
      id = url.split('v=')[1];
      if (id != null) {
        return id.includes('&') ? id.split('&')[0] : id
      }
    }
    else {
      var arrayUrl = url.split('/')
      if (arrayUrl.length > 3) {
        if (arrayUrl[arrayUrl.length - 1].includes('?')) {
          id = arrayUrl[arrayUrl.length - 1].split('?')[0]
        }
        else {
          id = arrayUrl[arrayUrl.length - 1];
        }

      }
    }
    return id;
  }

  getAllCategories() {
    this._categoryService.getAll("", 0, 100).subscribe((res) => {
      this.allCategory = res.items;
      this.getParentChildData();
    });
  }
  getCategories() {
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
  // @HostListener("window:payment.success", ["$event"])
  // onPaymentSuccess(event: any): void {
  //   this.paymentres.courseManagementId = this.courseId;
  //   this.paymentres.name = this.studentname;
  //   this.paymentres.price = this.course.price;
  //   this.paymentres.paymentType = "Course";
  //   this.paymentres.purchaseTitle = this.course.name;
  //   this._paymentService.createPayment(this.paymentres).subscribe();
  //   this.save();
  // }

  save() {
    this.loading = true;
    this.enrollCourse.courseManagementId = this.courseId;
    this.enrollCourse.studentId = this.studentId;
    this.enrollCourse.valideUpto =  this.course.validateDuration;
    this._enrollService
      .createEnrollCourse(this.enrollCourse)
      .subscribe((res) => {
        this.loading = false;
        window.location.reload();
        this.notify.success("Purchased Successfully");
        //this.location.go("app/student/my-course/my-course")
        //  window.location.reload();
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
        class: " modal-dialog-centered",
        initialState: {
          id: id,
        },
      });
    }
  }
  getpromotiondata() {
   this._promotionservice.getAll("", 0, 1000).subscribe((res) => {
   this.allpromotion = res.items;
    
    })

  }

}
