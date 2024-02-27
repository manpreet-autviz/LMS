import { AfterViewChecked, AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BlogAppServicesServiceProxy, BlogsDto, CourseManagementAppServicesServiceProxy, SubjectServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateBlogsComponent } from './create-blogs/create-blogs.component';
import { EditBlogsComponent } from './edit-blogs/edit-blogs.component';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CommonService } from '@shared/helpers/common.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  allBlogs: any = [];
  allCourses: any = [];
  allSubjects: any = [];
  courseId = 0;
  subjectId = 0;
  blogs: BlogsDto = new BlogsDto();
  title = 'datatables';
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 10,
    lengthMenu: [[10, 50, 100, 200, 500, -1], [10, 50, 100, 200, 500, "All"]],
    order: [],
  };
  loading = false;
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(injector: Injector, private commonService: CommonService, private router: Router, private _subjectService: SubjectServiceServiceProxy, private _courseService: CourseManagementAppServicesServiceProxy, private _blogsService: BlogAppServicesServiceProxy) { super(injector) }

  ngOnInit(): void {
    this.blogs.subjectId = 0;
    this.getAllBlogs();
    this.getAllCourses();
    this.getSubjects();
  }

  getAllBlogs() {
    this.loading = true;
    this._blogsService.getAllBlogs(this.subjectId).subscribe(res => {
      this.allBlogs = res;
      var navContent = { title: "Blog Management", lengthh: this.allBlogs.length }
      this.commonService.pageTitle.next(navContent)
      this.loading = false;
      this.renderer();
    },(err)=>{
      this.loading=false;
    });
  }

  getAllCourses() {
    this.loading = true;
    this._courseService.getAll("", 0, 100).subscribe(res => {
      this.allCourses = res.items;
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  getSubjects() {
    this.loading = true;
    this._subjectService.getAll("", 0, 100).subscribe(res => {
      this.allSubjects = res.items;
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  showCreateOrEditDialog(id?: number): void {
    if (!id) {
      this.router.navigate(['/app/create-blogs']);
    } else {
      this.router.navigate(['/app/edit-blogs/' + id])
    }
  }

  delBlogs(blogs: any) {
    abp.message.confirm(
      this.l("This blog will be deleted...!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._blogsService.delete(blogs.id).subscribe(res => {
            this.notify.success("Deleted SuccessFully");
            this.getAllBlogs();
          });
        }
      }
    );
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

  resetFilter() {
    this.subjectId = 0;
    this.getAllBlogs();
  }

}
