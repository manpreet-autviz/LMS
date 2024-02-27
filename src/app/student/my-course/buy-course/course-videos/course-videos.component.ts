import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { Component, AfterViewInit, Injector, Input, OnInit, HostListener, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { StartfreeTrialComponent } from "@app/student/startfree-trial/startfree-trial.component";
import { ContentManagementDto, ContentManagementServiceServiceProxy, CourseManagementAppServicesServiceProxy, CourseManagementDto, PaymentDto, PaymentServiceProxy, SessionServiceProxy, StudentCoursesDto, SubjectServiceServiceProxy, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { time } from 'console';
declare var Razorpay: any;
@Component({
  selector: 'app-course-videos',
  templateUrl: './course-videos.component.html',
  styleUrls: ['./course-videos.component.scss']
})
export class CourseVideosComponent implements OnInit, AfterViewInit {

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
  @Input() videosProps: any[];
  videos: any;
  videosData: any;
  loading = false;
  allVideoSubjects: any = [] = [];
  allVideoTopics: any = [] = [];
  subjectId: any;
  subjectName: any;
  topicsName: any;
  id: any;
  allSubjectItems: any = [] = [];
  courseId: any;
  paymentId: string;
  studentId: number;
  error: string;
  price: any;
  studentInfo: any;
  studentname: string;
  freeVideos: any[];
  courseDetails: any;
  contentId: any;
  paymentres: PaymentDto = new PaymentDto();
  course: CourseManagementDto = new CourseManagementDto();
  studentCourse: StudentCoursesDto = new StudentCoursesDto();
  contentMang: ContentManagementDto = new ContentManagementDto();
  notify: any;
  topicsId: any
  topicsBasedOnSubject: any = [];
  constructor(injector: Injector, private _subService: SubjectServiceServiceProxy,
    private _paymentService: PaymentServiceProxy, private _sessionService: SessionServiceProxy
    , public router: Router, private _contentService: ContentManagementServiceServiceProxy, private _modalService: BsModalService,
    private _courseService: CourseManagementAppServicesServiceProxy, private route: ActivatedRoute, private _topicService: TopicsServiceProxy) { }

  ngAfterViewInit(): void {
    this.videos = this.videosProps;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.id = params['id']
      this.getStudent();
    });
    this.subjectId = -1;
    this.topicsId = -1;
    this.getCoursedetail(this.id);
    this.getAllSubjects();

  }

  getAllSubjects() {
    this._contentService.getAllContentSubjects().subscribe(res => {
      this.allSubjectItems = res;
    })
  }

  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.studentId = res.user.id;
      this.studentInfo = res.user;
      this.studentname = res.user.name;
      //this.paymentType=res.payment
    });
  }
  getCoursedetail(id) {
    this.loading = true;
    this._courseService.getStudentCourse(id).subscribe(res => {
      this.videos = res.videos;
      if( this.videos!=null &&  this.videos.length>0){
        this.videosData = this.videos.sort((v1, v2) => v2.index - v1.index);
      }
      //  this.allVideoTopics = [...new Set(res.videos?.filter((item) => item.topicsName !== null).map((item) => item.topicsName))];
      const uniqueSubjects = {};
      res.videos?.forEach(item => {
        const subjectId = item.subjectId;
        const subjectName = item.subjectName;
        if (!uniqueSubjects[subjectId]) {
          uniqueSubjects[subjectId] = subjectName;
        }
      });
      this.allVideoSubjects = Object.keys(uniqueSubjects).map(subjectId => ({ subjectId: parseInt(subjectId), subjectName: uniqueSubjects[subjectId] }));
      this.courseDetails = res;
      this.price = this.courseDetails.price * 100;
      this.loading = false;

    },(err)=>{
      this.loading=false;
    });
  }
  onSubjectChanges(event) {
    if (event == "") {
      return
    }
    this._topicService.getTopicsBySubject(event).subscribe(res => {
      const videoTopics = this.videos.map((item) => item.topicsName)
      this.allVideoTopics = res.filter(topic => videoTopics.includes(topic.title))
      if (this.allVideoTopics.length <= 0) {
        this.topicsId = -1;
      }
    })
  }
  filterTopic(topicsId: any) {
    if (topicsId == null || topicsId == "") {
      this.videosData = this.videos;
    }
    else {
      this.videosData = this.videos.filter(a => a.topicsId == topicsId);
    }
  }
  filterSubject(subjectId: any) {
    if (subjectId == null || subjectId == "") {
      this.videosData = this.videos;
    }
    else {
      this.videosData = this.videos.filter(a => a.subjectId == subjectId);
    }
  }

  showVideo(id: number) {
    this.router.navigate(['app/student/student-live/' + id])
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

  startFreeTrialCourse(price, id: number): void {
    if (price == 0) {
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
    else {
      this.paynow(id);
    }
  }
}


