import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { CourseManagementAppServicesServiceProxy, JobNotificationDto, JobNotificationServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-job-notification',
  templateUrl: './job-notification.component.html',
  styleUrls: ['./job-notification.component.scss']
})
export class JobNotificationComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
  allJobNotifications: any[];
  startvalue: string;
  endvalue: string;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  title = 'datatables';
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 10,
    lengthMenu: [[10, 50, 100, 200, 500, -1], [10, 50, 100, 200, 500, "All"]],
    order: [],
};
  loading = false;
  dtTrigger: Subject<any> = new Subject<any>();
  allCourses: any = [];
  jobsNoti: JobNotificationDto = new JobNotificationDto();
  constructor(injector: Injector, private commonService: CommonService, private router: Router, private _service: JobNotificationServiceServiceProxy, private _courseService: CourseManagementAppServicesServiceProxy) { super(injector) }

  ngOnInit(): void {
    this.getAllJobNotification();
    this.getAllCourses();
   
  }
  getAllJobNotification(){
    this.loading = true;
    this._service.getAllJobs().subscribe(res => {
      this.allJobNotifications = res;
      var navContent = { title: "Job Notification", lengthh: this.allJobNotifications.length }
      this.commonService.pageTitle.next(navContent)
      this.loading = false;
      this.renderer();
    },(err)=>{
      this.loading=false;
    });
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  renderer(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

        dtInstance.destroy();

        this.dtTrigger.next();

      });
    }

  }
  getAllCourses() {
    this.loading = true;
    this._courseService.getAll("", 0, 1000).subscribe(
      res => {
        this.allCourses = res.items;
        this.loading = false;
      },(err)=>{
        this.loading=false;
      });
  }
  showCreateOrEditDialog(id?: number): void {
    if (!id) {
      this.router.navigate(['/app/create-jobnotification'])
    } else {
      this.router.navigate(['/app/edit-jobnotification/' + id])
    }

 
 }
delJobNotification(jobNotification:any){
  abp.message.confirm(
    this.l( "This job Notification will be deleted....!!"),
    undefined,
    (result: boolean) => {
      if (result) {
        this._service.delete(jobNotification.id).subscribe(res => {
          this.notify.success("Deleted SuccessFully");
          this.getAllJobNotification();
        });
      }
    }
  );
}
}
