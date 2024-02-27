import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateTeacherComponent } from './create-teacher/create-teacher.component';
import { EditTeacherComponent } from './edit-teacher/edit-teacher.component';
import { CommonService } from '@shared/helpers/common.service';
import { ResetPasswordDialogComponent } from '@app/users/reset-password/reset-password.component';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent extends AppComponentBase implements OnInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  allTeachers: any = [];
  title = 'datatables';
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 10,
    lengthMenu: [[10, 50, 100, 200, 500, -1], [10, 50, 100, 200, 500, "All"]],
    order: [],
  };
  loading = false;
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(injector: Injector, private _teacherService: UserServiceProxy,
    private _modalService: BsModalService,
    private commonService: CommonService) { super(injector) }

  ngOnInit(): void {
    this.getAllTeachers();
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
  getAllTeachers() {
    this.loading = true;
    this._teacherService.getAllUsersByRoles('Teacher').subscribe(
      res => {
        this.allTeachers = res;
        var navContent = { title: "Teacher Management", lengthh: this.allTeachers.length }
        this.commonService.pageTitle.next(navContent)
        this.loading = false;
        this.renderer();

      },(err)=>{
        this.loading=false;
      });
  }
  showCreateOrEditDialog(id?: number): void {
    let createOrEditTenantDialog: BsModalRef;
    if (!id) {
      createOrEditTenantDialog = this._modalService.show(
        CreateTeacherComponent,
        {
          class: 'modal-lg modal-dialog-centered',
        }
      );
    } else {
      createOrEditTenantDialog = this._modalService.show(
        EditTeacherComponent,
        {
          class: 'modal-lg modal-dialog-centered',
          initialState: {
            id: id,
          },
        }
      );
    }
    createOrEditTenantDialog.content.onSave.subscribe(() => {
      this.getAllTeachers();
    });
  }
  delTeacher(teacher: any) {
    abp.message.confirm(
      this.l(teacher.name + " will be deleted....!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._teacherService.delete(teacher.id).subscribe(res => {
            this.notify.success("Deleted SuccessFully");
            this.getAllTeachers();
          });
        }
      }
    );
  }
  resetPassword(id) {
    this._modalService.show(ResetPasswordDialogComponent, {
      class: 'modal-lg',
      initialState: {
        id: id,
      },
    });
  }
}
