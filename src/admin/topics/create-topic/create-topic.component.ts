import { IfStmt } from '@angular/compiler';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MultiTopicDto, SubjectServiceServiceProxy, TopicsDto, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.css']
})
export class CreateTopicComponent extends AppComponentBase implements OnInit {
  topic: MultiTopicDto = new MultiTopicDto();
  allSubjectItems: any = [];
  allSubItems = [];
  // maxChars = 10;
  @Output() onSave = new EventEmitter<any>();
  constructor(injector: Injector,public bsModalRef: BsModalRef,private _topicService: TopicsServiceProxy,private _subService:SubjectServiceServiceProxy, private _apiService: AppSessionService)
  {super(injector) }
  
    ngOnInit(): void {
      this.topic.subjectId = -1;
      this.getAllSubItems();
      this.add();
    }
  save(){
    this._apiService.loading.next(true);
    if(this.checkValidTopics()||this.topic.subjectId==null){
    this._topicService.addTopic(this.topic).subscribe(res=>{
      this.notify.info(this.l('SavedSuccessfully'));
      this.bsModalRef.hide();
      this._apiService.loading.next(false);
      this.onSave.emit();
    
    },(err)=>{
      this._apiService.loading.next(false);
    });
  }
}
  add() {
    var topicDto = new TopicsDto();
    topicDto.title = ''
    if (this.topic.topics == null) {
      this.topic.topics = [];
    }

    this.topic.topics.push(topicDto)
  }

  getAllSubItems() {
    this._subService.getAll('', 0, 100).subscribe(res => {
      this.allSubjectItems = res.items;
    })
  }
  delTopic(index: number) {
    this.topic.topics.splice(index, 1)
  }

  trimStart(data): void {
    data.title = data.title.trimStart();
}


checkValidTopics(){
  var isInvalid = false
  this.topic.topics.forEach(item=>{
    var whiteSpace = item.title.trim();
    if(item.title == null || whiteSpace==''){
      this.notify.info("Please fill the required Fields")
      isInvalid = true
    }
  })
  if(this.topic.subjectId == -1){
    this.notify.info("Please select Subject")
    isInvalid = true
  }
  if(isInvalid){
    return false;
  }
  else{
    return true;
  }
}



}

