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
} from "@shared/service-proxies/service-proxies";
import { DataTableDirective } from "angular-datatables";
import { cloneDeep } from "lodash-es";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { CreateCategoryComponent } from "./create-category/create-category.component";
import { EditCategoryComponent } from "./edit-category/edit-category.component";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  allCategories: any[];
  treeData: any;
  cols = [];
  loading = false;
  posts;
  title = 'datatables';
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 10,
    lengthMenu: [[10, 50, 100, 200, 500, -1], [10, 50, 100, 200, 500, "All"]],
    order: [],
  };
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _categoryService: CategoryAppServicesServiceProxy,
    private commonService:CommonService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.cols = [{ field: "categoryName", header: "Category Name" }];
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

  getAllCategories() {
    this.loading = true;
    this._categoryService.getAll("", 0, 100).subscribe(res => {
      this.allCategories = res.items;
      var navContent = { title: "Category Management", lengthh: this.allCategories.length }
    this.commonService.pageTitle.next(navContent)
      this.loading = false;
      this.getParentChildData();
      this.renderer();
    },(err)=>{
      this.loading=false;
    });
  }
  getParentChildData() {

    //  this.loading = true;
    this.treeData = cloneDeep(this.allCategories.filter(x => x.parentId == null));
    this.treeData.forEach(element => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["children"] = this.allCategories.filter(
        (x) => x.parentId == element.id
      );
      this.getChildrenData(element["children"]);
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }
  getChildrenData(data) {
    //this.loading = true;
    data.forEach(element => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      if (element.linkedId != -1) {
        element["children"] = this.childrenTree(element.id);
      }
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }
  childrenTree(id) {
    var children = this.allCategories.filter((c) => c.parentId == id);
    children.forEach((element) => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
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
        CreateCategoryComponent,
        {
          class: "modal-lg modal-dialog-centered",
        }
      );
    } else {
      createOrEditTenantDialog = this._modalService.show(
        EditCategoryComponent,
        {
          class: "modal-lg modal-dialog-centered",
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditTenantDialog.content.onSave.subscribe(() => {
      this.getAllCategories();
    });
  }
  delCategory(category: any) {
    abp.message.confirm(
      this.l(category.categoryName + " will be deleted....!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._categoryService.delete(category.id).subscribe((res) => {
            this.notify.success("Deleted SuccessFully");
            this.getAllCategories();
          });
        }
      }
    );
  }
}
