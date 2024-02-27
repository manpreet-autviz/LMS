import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MultiTopicDto, SubjectDto, SubjectServiceServiceProxy, TopicsDto, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { cloneDeep } from 'lodash-es';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.css']
})
export class EditTopicComponent extends AppComponentBase implements OnInit {
  id: any;
  topic: TopicsDto = new TopicsDto();
  multitopic: MultiTopicDto = new MultiTopicDto();
  multitopicData: any = [];
  allSubjectItems: any = [];
  subject: SubjectDto = new SubjectDto();
  subjects: any;
  topics: any;
  allTopics: any = [];
  isDisabled: boolean = true;
  @Output() onSave = new EventEmitter<any>();
  constructor(injector: Injector, public bsModalRef: BsModalRef, private _topicService: TopicsServiceProxy, private _subjectService: SubjectServiceServiceProxy, private _apiService: AppSessionService) { super(injector) }
  ngOnInit(): void {
    this.getAllSubItems();
    this.add()

  }
  getAllSubItems() {
    this._subjectService.getAll('', 0, 100).subscribe(res => {
      this.allSubjectItems = res.items;
      this.getTopicBySubject();
    });

  }

  getTopicBySubject() {
    this._topicService.getTopicsBySubject(this.id).subscribe(res => {
      this.multitopic.subjectId = this.id;
      this.multitopicData.topics = res;
      if (this.multitopicData.topics.length > 0) {
        this.multitopic.topics = res
      }

    })
  }
  add() {
    var topicDto = new TopicsDto();
    topicDto.title = ''
    if (this.multitopic.topics == null) {
      this.multitopic.topics = [];
    }
    this.multitopic.topics.push(topicDto)
  }
  delTopic(index: number) {
    this.multitopic.topics.splice(index, 1)
  }
  trimStart(data): void {
    data.title = data.title.trimStart();
  }

  checkValidTopics() {
    var isInvalid = false
    this.multitopic.topics.forEach(item => {
      if (item.title == null || item.title == '') {
        this.notify.info("Please fill the required Fields")
        isInvalid = true;
      }
    })
    if (isInvalid) {
      return false;
    }
    else {
      return true;
    }
  }

  save() {
    this._apiService.loading.next(true);
    if (this.checkValidTopics() || this.topic.subjectId == null) {
      this._topicService.updateMultiTopics(this.multitopic).subscribe(res => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this._apiService.loading.next(false);
        this.onSave.emit();
      },(err)=>{
        this._apiService.loading.next(false);
      });
    }
  }
}