import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  CategoryAppServicesServiceProxy,
  CategoryDto,
  CommonServiceServiceProxy,
  CourseManagementAppServicesServiceProxy,
  CourseManagementDto,
  CreateUserDto,
  EnrollCoursesServiceProxy,
  UserDto,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { debug } from "console";
import { cloneDeep, update } from "lodash-es";
import { IDropdownSettings } from "ng-multiselect-dropdown/multiselect.model";
import { BsModalRef } from "ngx-bootstrap/modal";
import { TreeSelect } from "primeng/treeselect";

@Component({
  selector: "app-editcourse",
  templateUrl: "./editcourse.component.html",
  styleUrls: ["./editcourse.component.css"],
})
export class EditcourseComponent extends AppComponentBase implements OnInit {
  id: any;
  course: CourseManagementDto = new CourseManagementDto();
  allCategory: any = [];
  treeData: any;
  selectedNode: any;
  selectedCategory: any;
  placeholder: any;
  disabled=true;
  loading = false;
  @ViewChild(TreeSelect) ptree: TreeSelect;
  @Output() onSave = new EventEmitter<any>();
  isImageUpladedStatus: string = "";
  imageFile: string;
  isDisabled: boolean = true;
  allStudents: any = [];
  selectedStd:any;
 user: UserDto = new UserDto();
  allStudName: any = [];
  
  selectedStudent:any;
   Studentdata: [] = [];
  dropdownSettings: IDropdownSettings
 
  constructor(
    public commonService: CommonServiceServiceProxy,
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _categoryService: CategoryAppServicesServiceProxy,
    private _apiService: AppSessionService,
    private _service: UserServiceProxy,
    private _enrollCourseService: EnrollCoursesServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
   
    this.getCourse();
    this.getAllCategories();
    this.getAllStudents();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'emailAddress',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,

      };
  }

  onUpload(file) {
    if (!file) {
      this.imageFile = "";
    }
    if (file) {
      this.isImageUpladedStatus = "start";
      file = {
        fileName: file[0].name,
        data: file[0],
      };
    }
    this.commonService.uploadImage(file).subscribe((res) => {
      this.isImageUpladedStatus = "end";
      this.course.imagePath = res.showLink;
      this.imageFile = res.saveLink;
    });
  }

 


  getCourse() {
    this._courseService.get(this.id).subscribe((res) => {
    this.course = res;
 
     this._courseService.getallstudAsssign(this.id).subscribe(res => {
      this.selectedStudent=  res.map((_item:any)=>
       {
              if(_item?.user)
              return {
                id: _item.user.id, emailAddress: _item.user.emailAddress
              }    
     }).filter(Boolean)
    
        })
        this._categoryService.get(res.categoryId).subscribe((category) => {
        this.placeholder = category.categoryName;
        this.imageFile = this.course.imagePath;
        });
    });
  }

  getAllCategories() {
    this._categoryService.getAll("", 0, 1000).subscribe((res) => {
      this.allCategory = res.items;
      this.getParentChildData();
    });
  }

  getParentChildData() {
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
    });
  }

  getChildrenData(data) {
    data.forEach((element) => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      if (element.linkedId != -1) {
        element["children"] = this.childrenTree(element.id);
      }
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

  setCategory(id) {
    this.course.categoryId = id;
  }
  save() {
   
    if (this.imageFile == null || this.course.imagePath == null || this.course.imagePath == "" ) {
      this.imageFile = "";
    }
    var whiteSpaceCheck = this.course.name.trim();
    if (whiteSpaceCheck == "" || this.course.categoryId == -1) {
      this.notify.info("Please Fill the Required Field.");
    }
    else {
      this._apiService.loading.next(true);
      this.course.imagePath = this.imageFile;
      this.course.studentIds = this.selectedStudent.map((b: any) => b.id)
       this._courseService.updateCourse(this.course).subscribe((res) => {
      
        this.notify.info(this.l("SavedSuccessfully"));
        this.bsModalRef.hide();
        this._apiService.loading.next(false);
        this.onSave.emit();
      });
    }
  }
  getAllStudents() {
   
    this._service.getAllUsersByRoles('Student').subscribe(
      res => {
        this.allStudents = res;
     let selectedFilterName: any = this.selectedStudent?.filter((q: any) => this.allStudents.map(w => w.id).includes(q.id));
       this.selectedStudent = cloneDeep(selectedFilterName);
    
      })
  }


  onSelectAll() {
 this._service.getAllUsersByRoles('Student').subscribe((res: any) => {
      this.allStudents = res;
    })
  }

  onDeSelectItem() {
  this.getAllStudents();
  }

onUnSelectAll() {
   this.selectedStudent = [];
 }
}

function getAllCategories() {
  throw new Error("Function not implemented.");
}
