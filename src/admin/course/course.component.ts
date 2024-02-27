import {
  AfterViewInit,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { CommonService } from "@shared/helpers/common.service";
import {
  CategoryAppServicesServiceProxy,
  CategoryDto,
  CourseManagementAppServicesServiceProxy,
  CourseManagementDto,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { DataTableDirective } from "angular-datatables";
import { cloneDeep } from "lodash-es";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { CreatecourseComponent } from "./createcourse/createcourse.component";
import { EditcourseComponent } from "./editcourse/editcourse.component";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.scss"],
})
export class CourseComponent
  extends AppComponentBase
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  title = "datatables";
  dtOptions: DataTables.Settings = {
    pagingType: "simple_numbers",
    pageLength: 10,
    lengthMenu: [
      [10, 50, 100, 200, 500, -1],
      [10, 50, 100, 200, 500, "All"],
    ],
    order: [],
  };
  loading = false;
  posts;
  course: CourseManagementDto = new CourseManagementDto();
  dtTrigger: Subject<any> = new Subject<any>();
  allCategory: any = [];
  allCourses: any = [];
  treeData: any;
  selectedNode: any;
  constructor(
    injector: Injector,
    private commonService: CommonService,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _categoryService: CategoryAppServicesServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.course.categoryId = -1;
    this.getAllCourses(this.course.categoryId);
    this.getAllCategories();
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
  getAllCourses(categoryId: any) {
    this.loading = true;
    this._courseService
      .getAllDataBasedOnCategory(categoryId, "")
      .subscribe((res) => {
        this.allCourses = res;
        var navContent = {
          title: "Course Management",
          lengthh: this.allCourses.length,
        };
        this.commonService.pageTitle.next(navContent);
        this.loading = false;
        this.renderer();
      },(err)=>{
        this.loading=false;
      });
  }

  getAllCategories() {
    this.loading = true;
    this._categoryService.getAll("", 0, 100).subscribe((res) => {
      this.allCategory = res.items;
      this.loading = false;
      this.getParentChildData();
    },(err)=>{
      this.loading=false;
    });
  }

  getParentChildData() {
    this.loading = true;
    var selectAllCategory = new CategoryDto();
    (selectAllCategory.id = -1),
      (selectAllCategory.categoryName = "All Category");
    this.allCategory.unshift(selectAllCategory);
    this.treeData = cloneDeep(
      this.allCategory.filter((x) => x.parentId == null)
    );
    this.treeData.forEach((element) => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      element["children"] = this.allCategory.filter(
        (x) => x.parentId == element.id
      );
      this.getChildrenData(element["children"]);
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }
  getChildrenData(data) {
    this.loading = true;
    data.forEach((element) => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      if (element.linkedId != -1) {
        element["children"] = this.childrenTree(element.id);
      }
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }
  childrenTree(id) {
    var children = this.allCategory.filter((c) => c.parentId == id);
    children.forEach((element) => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      if (element.linkedId != -1) {
        element["children"] = this.childrenTree(element.id);
      }
    });
    return children;
  }

  showCreateOrEditDialog(id?: number): void {
    let createOrEditTenantDialog: BsModalRef;
    if (!id) {
      createOrEditTenantDialog = this._modalService.show(
        CreatecourseComponent,
        {
          class: "modal-dialog modal-dialog-centered modal-xl",
        }
      );
    } else {
      createOrEditTenantDialog = this._modalService.show(EditcourseComponent, {
        class: "modal-lg modal-dialog-centered course_modal",
        initialState: {
          id: id,
        },
      });
    }

    createOrEditTenantDialog.content.onSave.subscribe(() => {
      this.getAllCourses(this.course.categoryId);
    });
  }
  delCourse(course: any) {
    abp.message.confirm(
      this.l(course.name + " will be deleted...!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._courseService.delete(course.id).subscribe((res) => {
            this.notify.success("Deleted SuccessFully");
            this.getAllCourses(this.course.categoryId);
          });
        }
      }
    );
  }
}
