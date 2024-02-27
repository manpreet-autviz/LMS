import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  CategoryAppServicesServiceProxy,
  CategoryDto,
  CommonServiceServiceProxy,
  CourseManagementAppServicesServiceProxy,
  CourseManagementDto,
  EnrollCoursesDto,
  EnrollCoursesServiceProxy,
  UserDto,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { cloneDeep } from "lodash-es";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-createcourse",
  templateUrl: "./createcourse.component.html",
  styleUrls: ["./createcourse.component.scss"],
})
export class CreatecourseComponent extends AppComponentBase implements OnInit {
  course: CourseManagementDto = new CourseManagementDto();
  User: UserDto = new UserDto();
  enrollCourse: EnrollCoursesDto = new EnrollCoursesDto();
  user: any;
  allCategory: any = [];
  data = "";
  userId: any;
  treeData: any;
  selectedNode: any;
  selectedCategory: any;
  loading = false;
  allStudName: any = [];
  allStudents: any = [];
  selectedStudent: [] = [];
  dropdownSetting;

  @Output() onSave = new EventEmitter<any>();
  isImageUpladedStatus: string = "";
  imageFile: string;
  constructor(
    public commonService: CommonServiceServiceProxy,
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _service: UserServiceProxy,
    private _courseService: CourseManagementAppServicesServiceProxy,
    private _categoryService: CategoryAppServicesServiceProxy,
    private _apiService: AppSessionService,
    private _enrollCourseService: EnrollCoursesServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.course.categoryId = -1;
    this.course.emailAddress = null;
    this.User.id = -1;
    this.course.type = '';
    this.course.imagePath = "";
    this.course.validateDuration="";
    this.getAllCategories();
    this.getAllStudents();
    this.dropdownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'emailAddress',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
  }
  getAllCategories() {
    this._categoryService.getAll("", 0, 1000).subscribe((res) => {
      this.allCategory = res.items;
      this.allStudName = res;
      this.getParentChildData();
    });
  }

  getParentChildData() {

    this.treeData = cloneDeep(this.allCategory.filter(x => x.parentId == null));
    this.treeData.forEach(element => {
      element["name"] = element.categoryName;
      element["label"] = element.categoryName;
      element["data"] = element;
      element["expandedIcon"] = "pi pi-folder-open";
      element["collapsedIcon"] = "pi pi-folder";
      element["children"] = this.allCategory.filter(x => x.parentId == element.id);
      this.getChildrenData(element["children"])
    });
  }
  getChildrenData(data) {
    data.forEach(element => {
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
    var children = this.allCategory.filter(c => c.parentId == id);
    children.forEach(element => {
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
    this.course.categoryId = id.node.id;
  }
  save() {
      if (this.course.name == null || this.course.categoryId == -1 ||this.course.price == null || this.course.type == '' || this.allStudName.emailAddress == '') {
      this.notify.info("Please Fill the Required Fields.")
    }
    else {
      this._apiService.loading.next(true);
      this.course.imagePath = this.imageFile;
      this.course.studentIds = this.selectedStudent.map((b: any) => b.id)
      this._courseService.createCourse(this.course).subscribe(res => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide()
        this._apiService.loading.next(false);
        this.onSave.emit();
       

      },(err)=>{
        this._apiService.loading.next(false);
      });

    }
  }

  onUpload(file) {
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

  getAllStudents() {
    this._service.getAllUsersByRoles('Student').subscribe(
      res => {
         this.allStudName=res;
        let selectedFilterName: any = this.selectedStudent?.filter((q: any) => this.allStudName.map(w => w.id).includes(q.id));
        this.selectedStudent = cloneDeep(selectedFilterName);
      })
  }

  onSelectAll() {
   
   this._service.getAllUsersByRoles('Student').subscribe((res: any) => {
    this.allStudName=res;
    })
 }

 onDeSelectItem() {
 
  this.getAllStudents();
  }

  onUnSelectAll() {
  
  this.selectedStudent = [];
   // this.allStudName=[];
  }


}
