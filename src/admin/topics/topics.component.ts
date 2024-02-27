import { createViewChild } from '@angular/compiler/src/core';
import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { SubjectDto, SubjectServiceServiceProxy, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { EditTopicComponent } from './edit-topic/edit-topic.component';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent extends AppComponentBase implements OnInit,AfterViewInit,OnDestroy {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  allTopics: any = [];
  title = 'datatables';
  text: string = ""
 

  dtOptions: DataTables.Settings = {
    pageLength: 10,
    pagingType: 'simple_numbers',
    lengthMenu: [[10,50,100,200,500,-1],[10,50,100,200,500,"All"]],
    order: [],
  };
  loading = false;
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(injector: Injector, private commonService:CommonService,private _topicService: TopicsServiceProxy, private _modalService: BsModalService, private _subService: SubjectServiceServiceProxy) { super(injector) }

  ngOnInit(): void {
    this.getAllTopic();
  
  }
  ngAfterViewInit() : void{
this.dtTrigger.next();
  }

  ngOnDestroy(): void{
this.dtTrigger.unsubscribe();
  }

  renderer(): void{
    if(this.dtElement && this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance : DataTables.Api)=>{
        dtInstance.destroy();
        this.dtTrigger.next();
      })
    }
  }
  getAllTopic() {
    this.loading = true;
    this._topicService.getAllTopics().subscribe(res => {
      this.allTopics = res;
      var navContent = { title: "Topic Management", lengthh: this.allTopics.length }
      this.commonService.pageTitle.next(navContent)
      this.loading = false;
      this.renderer();
    },(err)=>{
      this.loading=false;
    });
  }

 
  
  getTopicName(topics: []) {
    return topics.length != 0 ? topics.map((a: any) => a.title) : ''
  }
  showTopics(id?: number): void {
    let createOrEditTenantDialog: BsModalRef;
    if (!id) {
      createOrEditTenantDialog = this._modalService.show(
        CreateTopicComponent,
        {
          class: 'modal-lg modal-dialog-centered',
        }
      );
    } else {
      createOrEditTenantDialog = this._modalService.show(
        EditTopicComponent,
        {
          class: 'modal-lg modal-dialog-centered',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditTenantDialog.content.onSave.subscribe(() => {
      this.getAllTopic();
    });
  }
}
