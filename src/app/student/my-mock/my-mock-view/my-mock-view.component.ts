import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ViewResultComponent } from "@app/student/mock-test/view-result/view-result.component";
import { AppComponentBase } from "@shared/app-component-base";
import {
  EnrollMockTestDto,
  EnrollMockTestServiceProxy,
  MockTestServiceProxy,
  MockTestUserAnsServiceProxy,
  MockTestDto,
  MockTestUserAnsDto,
  SessionServiceProxy,
  EnrollCoursesServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Location } from "@angular/common";
import { title } from "process";
import * as moment from "moment";
import { iter } from "@amcharts/amcharts4/core";
import { ItemsList } from "@ng-select/ng-select/lib/items-list";

@Component({
  selector: "app-my-mock-view",
  templateUrl: "./my-mock-view.component.html",
  styleUrls: ["./my-mock-view.component.scss"],
})
export class MyMockViewComponent extends AppComponentBase implements OnInit {
  mock: any = [];
  allCourses: any = [];

  enrollmock: EnrollMockTestDto = new EnrollMockTestDto();
  mockTest: MockTestDto = new MockTestDto();
  mockTestUserAns: MockTestUserAnsDto = new MockTestUserAnsDto();
  allMockTest: any = [];
  loading = false;
  studentId: number;
  mockTestId: any;
  sectionData: any;
  tab: any = "my-mock";
  validDate = moment(new Date()).add("1", "years").format("YYYY-MM-DD");

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    public router: Router,
    private _sessionService: SessionServiceProxy,
    private _enrollService: EnrollCoursesServiceProxy,
    private _enrollMockService: EnrollMockTestServiceProxy,
    private _mockTestService: MockTestServiceProxy,
    private _mockTestUserAnsService: MockTestUserAnsServiceProxy,
    private route: ActivatedRoute,
    private location: Location
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getStudent();
  }

  viewResult(id: number): void {
    let createOrEditTenantDialog: BsModalRef;
    if (id) {
      createOrEditTenantDialog = this._modalService.show(ViewResultComponent, {
        class: "modal-lg modal-dialog-centered",
        initialState: {
          id: id,
        },
      });
    }
  }

  getStudent() {
    this.loading = true;
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.studentId = res.user.id;

      this.getStudentCourses(this.studentId);
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  getStudentCourses(studentId: any) {
    this.loading = true;
    this._enrollService.getAllEnrollCourses(studentId).subscribe((res) => {
      this.allCourses = res.filter(
        (res) => res.courseManagement.type == "Mock"
      );
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  onclick(id: any) {
    this.router.navigateByUrl("/app/student/my-course/view/" + id + "/notes");
  }

  showInstruction(id: number, item?) {
    this.router.navigate(["app/student/general-instructions/" + id]);
  }

  start(id: number, item?) {
    this._mockTestService.getMockTestSection(id).subscribe((res) => {
      this.sectionData = res;

      if (item.isView) {
        abp.message.confirm(
          this.l(
            "If you select Yes It will resume the test otherwise If you select Cancel it will  start again"
          ),
          this.l("Do you want to Resume the  mocktest...!!"),
          (result: boolean) => {
            if (result) {
              localStorage.removeItem("tab");
              this.router.navigate(["app/student/mock-test/" + id]);
            } else {
              this.reattempt(id);
            }
          }
        );
      } else {
        this._mockTestUserAnsService
          .createUserMockTestAllSection(this.sectionData)
          .subscribe();
        this._enrollMockService.markIsView(item.id).subscribe((res) => {
          this.router.navigate(["app/student/mock-test/" + id]);
        });
      }
    });
  }

  back() {
    this.router.navigate(["/app/student/mock/upcoming"]);
  }

  reattempt(id: number) {
    localStorage.removeItem("tab");
    this.router.navigate(["app/student/mock-test/" + id + "/true"]);
  }

  showReattemptMessage(id: any) {
    abp.message.confirm(
      this.l("Do you want to reattempt this mocktest...!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this.router.navigate(["app/student/general-instructions/" + id]);
        }
      }
    );
  }
}
