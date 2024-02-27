import {
  Component,
  Injector,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { AppComponentBase } from "@shared/app-component-base";
import { CommonService } from "@shared/helpers/common.service";
import {
  CommonServiceServiceProxy,
  CourseManagementAppServicesServiceProxy,
  JobNotificationDto,
  JobNotificationServiceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import * as moment from "moment";
import { BsModalRef } from "ngx-bootstrap/modal";
@Component({
  selector: "app-edit-job-notification",
  templateUrl: "./edit-job-notification.component.html",
  styleUrls: ["./edit-job-notification.component.scss"],
})
export class EditJobNotificationComponent
  extends AppComponentBase
  implements OnInit
{
  id: any;
  startDate: any;
  lastDate: any;
  jobNoti: JobNotificationDto = new JobNotificationDto();
  allCourses: any = [];
  @Output() onSave = new EventEmitter<any>();
  dateRange = moment(new Date()).add("1", "days").format("YYYY-MM-DD");
  minimumDate = new Date();
  isImageUpladedStatus: string ='';
  imageFile: string;
  showNotes: string;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
      ],
      [
        'customClasses',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  constructor(
    public commonService: CommonServiceServiceProxy,
    injector: Injector,
    public router: Router,
    private activeRouter: ActivatedRoute,
    private _service: JobNotificationServiceServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _apiService: AppSessionService,
    private common:CommonService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    var navContent = { title: "Job Notification", lengthh: "-1" }
    this.common.pageTitle.next(navContent)
    this.activeRouter.params.subscribe((params) => {
      this.id = params.id;
    });
   
   this.jobNoti.mode = "-1"
    this.getJobNotifications();
    this.getCourses();
  }
  getJobNotifications() {
    this._service.get(this.id).subscribe((res) => {
      this.jobNoti = res;
      this.imageFile=this.jobNoti.image  
      if(this.jobNoti.startDate!=null)   {
        this.startDate = this.jobNoti.startDate.format("YYYY-MM-DD");
      }
      if(this.jobNoti.lastDate!=null)   {
        this.lastDate = this.jobNoti.lastDate.format("YYYY-MM-DD");;
      }
        
    });
  }
  test() {

  }
  setDate() {
    if (this.startDate !=null ) {
      this.jobNoti.startDate = moment(this.startDate)
        .add("5", "hours")
        .add("30", "minutes");
    } else {
      this.jobNoti.startDate= null;
    }

    if (this.lastDate!=null) {
      this.jobNoti.lastDate = moment(this.lastDate)
        .add("5", "hours")
        .add("30", "minutes");
    } else {
      this.jobNoti.lastDate = null;
    }
  }
  getCourses() {
    this._courseService.getAll("", 0, 100).subscribe((res) => {
      this.allCourses = res.items;
    });
  }
  save() {
    if(this.imageFile == null){
      this.imageFile ="";
    }
    if(this.jobNoti.image == '')
    {
   this.imageFile = '';
    }
    if(  this.jobNoti.notesUrl == null|| ( this.jobNoti.mode == "Online" && ( this.jobNoti.link == "" ||  this.jobNoti.link == null))){
      this.notify.info("Please Fill the Required Fields.")
    }
    else{
    this._apiService.loading.next(true);
    this.setDate();
    this.jobNoti.image = this.imageFile;
    this._service.update(this.jobNoti).subscribe((res) => {
      this.notify.info(this.l("SavedSuccessfully"));
      this._apiService.loading.next(false);
      this.onSave.emit();
      this.router.navigate(["/app/jobnotification"]);
    },(err)=>{
      this._apiService.loading.next(false);
    });
  }
  }
  cancel() {
    this.router.navigate(["/app/jobnotification"]);
  }
  onUpload(file) {
    if (file) {
      this.isImageUpladedStatus = "start";
      file = {
        fileName: file[0].name,
        data: file[0],
      };
    }
    this.commonService.uploadImage(file).subscribe((res) => {
      this.isImageUpladedStatus = "end";
      this.jobNoti.image = res.showLink;
      this.imageFile = res.saveLink;
    });
  }

  onFileUpload(file){
    if (file) {
      this.isImageUpladedStatus='start'
      file = {
        fileName: file[0].name,
        data: file[0]
      };
    }
    this.commonService.uploadImage(file).subscribe(res=>{
      this.isImageUpladedStatus='end'
      this.jobNoti.notesUrl =  res.saveLink
      this.showNotes=res.showLink
      
    })
  }
}
