import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { SubjectServiceServiceProxy, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  title = 'datatables';
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 10,
    lengthMenu: [[5, 10, 50, 100, 200, 500, -1], [5, 10, 50, 100, 200, 500, "All"]],
    order: [],
  };
  dtTrigger: Subject<any> = new Subject<any>();
  allSubjects: any = [];
  allTopics: any = [];
  constructor(injector: Injector, private commonService: CommonService, private route: Router, private _subjectService: SubjectServiceServiceProxy, private _topicService: TopicsServiceProxy) {
    super(injector)
  }
  loading = false;
  ngOnInit(): void {
    this.getAllSubjects();
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
      })
    }
  }
  getAllTopics() {
    this.loading = true;
    this._topicService.getAll('', 0, 100).subscribe(res => {
      this.allTopics = res.items;
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }
  getAllSubjects() {
    this.loading = true;
    this._subjectService.getAllSubjects().subscribe(res => {
      this.allSubjects = res;
      var navContent = { title: "Subject Management", lengthh: this.allSubjects.length }
      this.commonService.pageTitle.next(navContent)
      this.loading = false;
      this.renderer();
    },(err)=>{
      this.loading=false;
    });
  }
  showCreateOrEditDialog(id?: number): void {
    if (!id) {
      this.route.navigate(['/app/create-subject'])
    }
    else {

      this.route.navigate(['/app/edit-subject/' + id])
    }
  }
  delSubject(subject: any) {
    abp.message.confirm(
      this.l(subject.subjectName + " will be deleted...!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._subjectService.delete(subject.id).subscribe(res => {
            this.notify.success("Deleted SuccessFully");
            this.getAllSubjects();

          });
        }
      }
    );
  }

}

