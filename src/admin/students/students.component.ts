import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ResetPasswordDialogComponent } from '@app/users/reset-password/reset-password.component';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { DataTableDirective } from 'angular-datatables';
import { extend } from 'lodash-es';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CreateStudentComponent } from './create-student/create-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})

export class StudentsComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  allStudents: any = [];
  title = 'datatables';
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 10,
    lengthMenu: [[10, 50, 100, 200, 500, -1], [10, 50, 100, 200, 500, "All"]],
    order: [],
  };
  loading = false;
  posts;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(injector: Injector, private commonService: CommonService, private _modalService: BsModalService, private _service: UserServiceProxy) { super(injector) }

  ngOnInit(): void {
    this.getAllStudents();

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
  getAllStudents() {
    this.loading = true;
    this._service.getAllUsersByRoles('Student').subscribe(
      res => {
        this.allStudents = res;
        var navContent = { title: "Student Management", lengthh: this.allStudents.length }
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
        CreateStudentComponent,
        {
          class: 'modal-lg modal-dialog-centered',
        }
      );
    } else {
      createOrEditTenantDialog = this._modalService.show(
        EditStudentComponent,
        {
          class: 'modal-lg modal-dialog-centered',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditTenantDialog.content.onSave.subscribe(() => {
      this.getAllStudents();
    });
  }

  delStudent(student: any) {
    abp.message.confirm(
      this.l(student.name + " will be deleted....!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._service.delete(student.id).subscribe(res => {
            this.notify.success("Deleted Successfuly");
            this.getAllStudents();
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