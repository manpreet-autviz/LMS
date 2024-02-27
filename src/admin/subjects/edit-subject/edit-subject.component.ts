import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { SubjectDto, SubjectServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';


@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.scss']
})
export class EditSubjectComponent extends AppComponentBase implements OnInit {
  id: any;
  subject: SubjectDto = new SubjectDto();
  @Output() onSave = new EventEmitter<any>();
    constructor(injector: Injector,private commonService:CommonService,public route: Router,private _subjectService: SubjectServiceServiceProxy,private activatedRoute: ActivatedRoute, private _apiService: AppSessionService) {super(injector)}

    isAddMode: boolean;
    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
         this.id = params.id;
      });
      this.getSubject();
      var navContent = { title: "Manage Subject", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
    }
  getSubject(){
    this._subjectService.get(this.id).subscribe(res=>{
      this.subject = res;
    })
  }
  save(){
    this._apiService.loading.next(true);
    this._subjectService.updateSubject(this.subject).subscribe(res=>{
      this.notify.info(this.l('Updated  Successfully'));
      this._apiService.loading.next(false);
      this.onSave.emit();
      this.route.navigate(['/app/subjects'])
    },(err)=>{
      this._apiService.loading.next(false);
    });
  }
  cancel(){
    this.route.navigate(['/app/subjects'])
  }
  }