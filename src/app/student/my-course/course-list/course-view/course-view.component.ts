import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseManagementAppServicesServiceProxy, CourseManagementDto, EnrollCoursesDto, EnrollCoursesServiceProxy, SessionServiceProxy, StudentCoursesDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.scss']
})
export class CourseViewComponent implements OnInit {
  //enrollCourse: EnrollCoursesDto = new EnrollCoursesDto();
  course: CourseManagementDto = new CourseManagementDto();
  //enrollCourses : any=[];
  allCourses: any = [];
  allCourse: any = [];
  loading = false;
  studentId: number;
  validDate = moment(new Date()).add("1", "years").format("YYYY-MM-DD");
  constructor(private _enrollService: EnrollCoursesServiceProxy, private _sessionService: SessionServiceProxy, private _courseService: CourseManagementAppServicesServiceProxy, public router: Router) { }

  ngOnInit(): void {
    this.getStudent();
  }


  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe(res => {
      this.studentId = res.user.id;
      this.getStudentCourses(this.studentId);
    })
  }
  getStudentCourses(studentId: any) {
    this.loading = true;
    this._enrollService.getAllEnrollCourses(studentId).subscribe(res => {
      this.allCourses = res.filter(res => res.courseManagement.type == 'Video' || res.courseManagement.type == 'Hybrid');
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }
  onclick(id: any) {
    this.router.navigateByUrl('/app/student/my-course/view/' + id + '/notes')
  }
}
