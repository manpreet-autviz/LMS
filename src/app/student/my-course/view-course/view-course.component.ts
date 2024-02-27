import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { CourseManagementAppServicesServiceProxy, CourseManagementDto, EnrollCoursesDto, EnrollCoursesServiceProxy, EnrollMockTestDto, EnrollMockTestServiceProxy, SessionServiceProxy, StudentCoursesDto } from '@shared/service-proxies/service-proxies';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss']
})
export class ViewCourseComponent extends AppComponentBase
  implements OnInit, AfterViewInit {
  activeTab: any;
  selectedTab: string
  course: CourseManagementDto = new CourseManagementDto();
  studentCourse: StudentCoursesDto = new StudentCoursesDto();
  enrollMock: any = new EnrollMockTestDto();
  loading = false;
  id: any;
  courseId: number
  studentCourses: any = [];
  allCourses: any = [];
  freeVideos: any[];
  studentId: number;
  enrolledMockTests: any = [];
  NewEnrolledMockTest: any = [];
  mockTestData: any;
  enrollCourse: EnrollCoursesDto = new EnrollCoursesDto();
  constructor(injector: Injector, private location: Location,
    public router: Router, private common: CommonService,
    private _enrollMock: EnrollMockTestServiceProxy,
    private _sessionService: SessionServiceProxy,
    private _enrollCourseService: EnrollCoursesServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private route: ActivatedRoute) { super(injector); }
  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.activeTab = params.tab;
      var that = this
      setTimeout(function () {

        document.getElementById(that.activeTab + "-link").click();
      }, 2000);

    });
  }

  ngOnInit(): void {
    var navContent = { title: "My Course Details", lengthh: "-1" }
    this.common.pageTitle.next(navContent)
    this.getidFromRoute();
  }

  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe(res => {
      this.studentId = res.user.id;

    })
  }

  getEnrolledMockTestsData(id) {
      this._enrollMock.getEnrolledMockTestByUserIdAndCourseId(this.studentId, id).subscribe(res => {
      this.enrolledMockTests = res;
  
  });

    
  }
  getidFromRoute() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.courseId = params['id'];
      this.activeTab = params.tab;
      this.getCourseDetail(id);
    });
  }

  back() {
    if (this.studentCourse.type == "Mock") {
      this.router.navigate(['app/student/mock/upcoming'])
    }
    else {
      this.router.navigate(['app/student/my-course/list/all-course'])
    }
  }

  getCourseDetail(id) {
    this.loading = true;
    this._courseService.getStudentCourse(id).subscribe(res => {
      this.studentCourse = res;
      this.freeVideos = res.videos?.filter(res => res.isFree == true);
      this._sessionService.getCurrentLoginInformations().subscribe(res => {
        this.studentId = res.user.id;
        this.getEnrolledMockTestsData(id);
      })
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  showVideo(id: number) {
    this.router.navigate(['app/student/student-live/' + id])
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



  checkActive(tab) {
    if (tab == 'mock-test') {
      this.location.go("app/student/my-course/view/" + this.courseId + "/mock-test")
    }
    else if (tab == 'notes') {
      this.location.go("app/student/my-course/view/" + this.courseId + "/notes")
    }
    else if (tab == 'videos') {
      this.location.go("app/student/my-course/view/" + this.courseId + "/videos")
    }
    else {
      this.location.go("app/student/my-course/view/" + this.courseId + "/quiz")
    }

  }

}
