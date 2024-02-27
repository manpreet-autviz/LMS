import {
  EventEmitter,
  Component,
  OnInit,
  Injector,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
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

@Component({
  selector: "app-create-job-notification",
  templateUrl: "./create-job-notification.component.html",
  styleUrls: ["./create-job-notification.component.scss"],
})
export class CreateJobNotificationComponent
  extends AppComponentBase
  implements OnInit {
  jobNoti: JobNotificationDto = new JobNotificationDto();
  allCourses: any = [];
  startvalue: string;
  endvalue: string;
  dateRange = moment(new Date()).add("1", "days").format("YYYY-MM-DD");
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
  @Output() onSave = new EventEmitter<any>();
  error: { isError: boolean; errorMessage: string };
  isImageUpladedStatus: string = "";
  imageFile: string;
  showNotes: any;
  constructor(
    public commonService: CommonServiceServiceProxy,
    private common: CommonService,
    injector: Injector,
    public router: Router,
    private _service: JobNotificationServiceServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _apiService: AppSessionService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    var navContent = { title: "Job Notification", lengthh: "-1" }
    this.common.pageTitle.next(navContent)
    this.jobNoti.mode = "-1";
    this.jobNoti.image = "";
    this.getAllCourses();
  }
  setDate() {
    if (this.jobNoti.startDate) {
      this.jobNoti.startDate = moment(this.jobNoti.startDate)
        .add("5", "hours")
        .add("30", "minutes");
    } else {
      this.jobNoti.startDate = null;
    }

    if (this.jobNoti.lastDate) {
      this.jobNoti.lastDate = moment(this.jobNoti.lastDate)
        .add("5", "hours")
        .add("30", "minutes");
    } else {
      this.jobNoti.lastDate = null;
    }
  }
  getAllCourses() {
    this._courseService.getAll("", 0, 100).subscribe((res) => {
      this.allCourses = res.items;
    });
  }
  save() {
    this._apiService.loading.next(true);
    if (this.jobNoti.mode == "-1") {
      this.jobNoti.mode == null
    }
if(  this.jobNoti.notesUrl == null|| ( this.jobNoti.mode == "Online" && ( this.jobNoti.link == "" ||  this.jobNoti.link == null))){
  this.notify.info("Please Fill the Required Fields.")
}
else{

  this.setDate();
  this.jobNoti.image = this.imageFile;
  this._service.create(this.jobNoti).subscribe((res) => {

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


  onFileUpload(file) {
    if (file) {
      this.isImageUpladedStatus = 'start'
      file = {
        fileName: file[0].name,
        data: file[0]
      };
    }
    this.commonService.uploadImage(file).subscribe(res => {
      this.isImageUpladedStatus = 'end'
      this.jobNoti.notesUrl = res.saveLink
      this.showNotes = res.showLink

    })
  }
}
