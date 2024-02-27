import { AfterViewInit, Component, Injector, Input, OnInit, HostListener, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StartfreeTrialComponent } from '@app/student/startfree-trial/startfree-trial.component';
import { ContentManagementNotesDto, ContentManagementServiceServiceProxy, CourseManagementAppServicesServiceProxy, CourseManagementDto, PaymentDto, PaymentServiceProxy, SessionServiceProxy, StudentCoursesDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
declare var Razorpay: any;
@Component({
  selector: 'app-course-notes',
  templateUrl: './course-notes.component.html',
  styleUrls: ['./course-notes.component.scss']
})
export class CourseNotesComponent implements OnInit, AfterViewInit {
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
  @Input() notesProps: any[];
  notes: any[] = []
  id: any;
  isFree: boolean;
  isBuy: boolean;
  loading = false;
  courseId: any;
  paymentId: string;
  studentId: number;
  freeVideos: any[];
  error: string;
  courseDetails: any;
  price: any;
  studentInfo: any;
  activeTab: any;
  studentname: string;
  ischeckBuy:boolean= false;
  paymentres: PaymentDto = new PaymentDto();
  course: CourseManagementDto = new CourseManagementDto();
  studentCourse: StudentCoursesDto = new StudentCoursesDto();
  
   @Output() onSave = new EventEmitter<any>();
  notify: any;
  constructor(injector: Injector, public router: Router, private _paymentService: PaymentServiceProxy, private _sessionService: SessionServiceProxy,
    private _contentService: ContentManagementServiceServiceProxy,
    private cdrRef: ChangeDetectorRef,
    private _modalService: BsModalService, private _courseService: CourseManagementAppServicesServiceProxy, private route: ActivatedRoute) { }
  ngAfterViewInit(): void {
    this.cdrRef.detectChanges();
    setTimeout(() => {
      this.notes = this.notesProps?.filter(a => a.notesUrl.includes('lmsnotesstore'));
    }, )
      
  }
   ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.id = params['id']
    });
    this.getStudent();
    this.getCourseDetails(this.id)
    this.cdrRef.detectChanges();
  }

  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe(res => {
      this.studentId = res.user.id;
      this.studentInfo = res.user;
      this.studentname = res.user.name;

    })
  }

  // onScrollDown() {
  //   this.isQuestionLoading = true;
  //   this.direction = "down";
  //   var part = this.next();
  //   this.questions = this.questions.concat(part);
  //   setTimeout(() => {
  //     this.isQuestionLoading = false;
  //   }, 4000)

  // }

  getCourseDetails(id) {
    this.loading = true; 
     this._courseService.getStudentCourse(id).subscribe(res => {
      this.notes = res.notes;
      this.price=res.price*100;
      this.courseDetails = res;
      this.loading = false;
      this.cdrRef.detectChanges();
    },(err)=>{
      this.loading=false;
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
      this.paymentres.emailAddress = this.studentInfo.emailAddress ;

      this._paymentService.createPayment(this.paymentres).subscribe();
      this.notify.error("Payment Failed");
    });
  }
  showPdf(id: number) {
    this.router.navigate(['app/student/pdf-viewer/' + id])
  }

  startFreeTrialCourse( price,id :number){
  if(price==0){
  let createOrEditTenantDialog: BsModalRef;
  createOrEditTenantDialog = this._modalService.show(StartfreeTrialComponent, {
    class: "modal-dialog-centered",
    initialState: {
      id: id,
    },
    
  });
}else{
  this.paynow(id)
}     
    }
  }






