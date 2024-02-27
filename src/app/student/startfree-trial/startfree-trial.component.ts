import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseManagementAppServicesServiceProxy, CourseManagementDto, EnrollCoursesDto, EnrollCoursesServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-startfree-trial',
  templateUrl: './startfree-trial.component.html',
  styleUrls: ['./startfree-trial.component.scss']
})
export class StartfreeTrialComponent extends AppComponentBase implements OnInit {
  enrollCourse: EnrollCoursesDto = new EnrollCoursesDto();
  course: CourseManagementDto = new CourseManagementDto();
  studentId: any;
  studentname: string;
  studentInfo: any = [];
  CourseId: number;
  id: any
  @Output() onSave = new EventEmitter<any>();
  notify: any;
  constructor(private _enrollCourseService: EnrollCoursesServiceProxy,
    private _sessionService: SessionServiceProxy,
    public bsModalRef: BsModalRef,
    private cdrRef: ChangeDetectorRef,
    private router: Router,
    private _courseService: CourseManagementAppServicesServiceProxy,
    injector: Injector) { super(injector) }

  ngOnInit(): void {

    this.getStudent();
    this.getCourse();
  }

  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.studentId = res.user.id;
      this.studentInfo = res.user;
      this.studentname = res.user.name;
    });
  }

  getCourse() {
    this._courseService.get(this.id).subscribe(res => {
      this.course = res;
    })
  }
  startFreeTrial() {
    this.enrollCourse.courseManagementId = this.id;
    this.enrollCourse.studentId = this.studentId;
    this.enrollCourse.valideUpto = this.course.validateDuration;
    this._enrollCourseService
      .createEnrollCourse(this.enrollCourse)
      .subscribe((res) => {
        this.notify.success("You have successfully  started your FREE course")
        this.router.navigateByUrl("/app/student/my-course/view/" + this.id + "/mock-test");
      });
    this.bsModalRef.hide();
  }


  cancel() {
    this.bsModalRef.hide();
  }

  freetrial(id: any) {
    this.enrollCourse.courseManagementId = this.id;
    this.enrollCourse.studentId = this.studentId;
    this.enrollCourse.valideUpto = this.course.validateDuration;
    this._enrollCourseService
      .createEnrollCourse(this.enrollCourse)
      .subscribe((res) => {
        this.bsModalRef.hide();
      });
    this.router.navigate(['app/student/student-live/' + id])
    this.bsModalRef.hide();

  }
}
