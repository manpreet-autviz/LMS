import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { SubjectDto, SubjectServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.scss']
})
export class CreateSubjectComponent extends AppComponentBase implements OnInit {
  subject: SubjectDto = new SubjectDto();
  @Output() onSave = new EventEmitter<any>();
  constructor(injector: Injector, private route: Router, private commonService: CommonService, private _subjectService: SubjectServiceServiceProxy, private _apiService: AppSessionService) { super(injector) }

  ngOnInit(): void {
    var navContent = { title: "Manage Subject", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
  }
  save() {
    if (this.subject.subjectName == null) {
      this.notify.info("Please Fill the Required Fields")
    } else {
      this._apiService.loading.next(true);
      this._subjectService.createSubject(this.subject).subscribe(res => {
        this.notify.info(this.l('SavedSuccessfully'));
        this._apiService.loading.next(false);
        this.onSave.emit();
        this.route.navigate(['/app/subjects'])
      },(err)=>{
        this._apiService.loading.next(false);
      });
    }
  }
  cancel() {
    this.route.navigate(['/app/subjects'])
  }
}
