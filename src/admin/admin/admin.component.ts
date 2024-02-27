import {
  AfterViewInit,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ResetPasswordDialogComponent } from "@app/users/reset-password/reset-password.component";
import { AppComponentBase } from "@shared/app-component-base";
import { CommonService } from "@shared/helpers/common.service";
import { UserServiceProxy } from "@shared/service-proxies/service-proxies";
import { DataTableDirective } from "angular-datatables";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { CreateComponent } from "./create/create.component";
import { EditComponent } from "./edit/edit.component";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent
  extends AppComponentBase
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  title = "datatables";
  loading = false;
  dtOptions: DataTables.Settings = {
    pagingType: "simple_numbers",

    pageLength: 10,

    lengthMenu: [
      [10, 50, 100, 200, 500, -1],
      [10, 50, 100, 200, 500, "All"],
    ],

    order: [],
  };
  posts;
  dtTrigger: Subject<any> = new Subject<any>();
  allAdmins: any = [];

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _modalService: BsModalService,
    private commonService: CommonService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getAllAdmins();
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

  getAllAdmins() {
    this.loading = true;
    this._userService.getAllUsersByRoles("Admin").subscribe((res) => {
      this.allAdmins = res;
      var navContent = { title: "Admin Management", lengthh: this.allAdmins.length }
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
      createOrEditTenantDialog = this._modalService.show(CreateComponent, {
        class: "modal-lg modal-dialog-centered",
      });
    } else {
      createOrEditTenantDialog = this._modalService.show(EditComponent, {
        class: "modal-lg modal-dialog-centered",
        initialState: {
          id: id,
        },
      });
    }
    createOrEditTenantDialog.content.onSave.subscribe(() => {
      this.getAllAdmins();
    });
  }
  delAdmin(admin: any) {
    abp.message.confirm(
      this.l(admin.name + " will be deleted....!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._userService.delete(admin.id).subscribe((res) => {
            this.notify.success("Deleted Successfuly");
            this.getAllAdmins();
          });
        }
      }
    );
  }

  resetPassword(id) {
    this._modalService.show(ResetPasswordDialogComponent, {
      class: "modal-lg",
      initialState: {
        id: id,
      },
    });
  }
}
