import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "@shared/helpers/common.service";
import {
  ContentManagementServiceServiceProxy,
  CourseManagementAppServicesServiceProxy,
  CourseManagementDto,
  EnrollCoursesServiceProxy,
  SessionServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { event } from "jquery";

@Component({
  selector: "app-studentdashboard",
  templateUrl: "./studentdashboard.component.html",
  styleUrls: ["./studentdashboard.component.scss"],
})
export class StudentdashboardComponent implements OnInit {
  loading = false;
  allCourses: any = [];
  videos: any = [];
  course: CourseManagementDto = new CourseManagementDto();
  studentId: any;

  constructor(
    private _courseService: CourseManagementAppServicesServiceProxy,
    public route: Router,
    private _sessionService: SessionServiceProxy,
    private commonService: CommonService,
    private _enrollService: EnrollCoursesServiceProxy,
    private contentService: ContentManagementServiceServiceProxy,
    public router: Router
  ) {}

  ngOnInit(): void {
    var navContent = { title: "Dashboard", lengthh: -1 };
    this.commonService.pageTitle.next(navContent);
    this.getStudent();
    this.getAllVideos();
  }


  getStudent() {
    this.loading = true;
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.loading = false;
      this.studentId = res.user.id;
      this.getStudentCourses(this.studentId);
    },(err)=>{
      this.loading=false;
    });
  }

  getStudentCourses(studentId: any) {

    this._enrollService.getAllEnrollCourses(studentId).subscribe((res) => {

      this.allCourses = res;
    });
  }
  getAllVideos() {
    this.contentService.getAllContentVideos().subscribe((res) => {
      this.videos = res;
    });
  }

  navigateToBuyCourse(id: any) {
    this.route.navigateByUrl("/app/student/my-course/buy/" + id);
  }
  showVideo(id: number) {
    this.route.navigate(["app/student/student-live/" + id]);
  }

  getVideoId(url) {
    var id = "";
    if (Boolean(url) && url.includes('v=')) {
      id = url.split("v=")[1];
      if(id!=null){
        return id.includes("&") ? id.split("&")[0] : id;
      }
    }
    else{
      var arrayUrl = url.split('/')
      if(arrayUrl.length>3){
        id= arrayUrl[arrayUrl.length-1].split('?')[0]
      }
      else{
        id = arrayUrl[arrayUrl.length-1];
      }
    }
    return id;
  }
  }

