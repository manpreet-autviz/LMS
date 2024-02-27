import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { CommonServiceServiceProxy, ContentManagementNotesDto, CreateMockTestDto, MockTestDto, MockTestSectionDto, QuestionServiceProxy, SubjectDto, SubjectServiceServiceProxy, TopicsDto, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { cloneDeep } from 'lodash-es';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { elementAt } from 'rxjs/operators';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @Output() onSave = new EventEmitter<any>();
  @ViewChild('questionFile')
myInputVariable: ElementRef;
previousSelectedSubjectId:any
  addQuestion: AddQuestion = new AddQuestion();
  questions: any = [];
  createmockTestDto: CreateMockTestDto = new CreateMockTestDto();
  allQuestions: any = [];
  toString = [];
  isImageUpladedStatus: string;
  fileName: any;
  selectedTopics: any;
  allSubject: SubjectDto[];
  allTopics: TopicsDto[];
  isSectionBased: any = false;
  quest: any = [];
  allIds=[];
  isCheck:boolean=false;
  mockTest: MockTestDto = new MockTestDto();
  loading = false;
  inavlidQuesData:boolean=false;
  dropdownSetting: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  constructor(public _topicService: TopicsServiceProxy, public _subjectService: SubjectServiceServiceProxy, public questionService: QuestionServiceProxy, injector: Injector, public bsModalRef: BsModalRef, public commonService: CommonServiceServiceProxy,
    private common :CommonService) { super(injector) }
  ngAfterViewInit(): void {
    if (this.quest?.length > 0) {
      this.questions = this.quest
    
    }
    else if(this.common.addQuestions.length>0){
      this.questions=cloneDeep(this.common.addQuestions);
    }
    else {
      this.addMultiNotes();
    }
  }
  ngOnInit(): void {
    localStorage.getItem('isSectionBasedMock')
    this.isSectionBased = localStorage.getItem('isSectionBasedMock');
    this.dropdownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All ',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getAllSubjects();
  }
  addMultiNotes() {
    var question = new AddQuestion();
    question.mockTestSection.subjectId=-1;
    if (this.questions == null) {
      this.questions = [];
    }
    this.questions.push(question)
  }
  delNote(index: number) {
    this.questions.splice(index, 1)
  }

  submit() {
    this.loading=true;
    this.isCheck=false;
    this.questions.forEach(element=>{
     this.addQuestion.fileName; 
      element.mockTestSection.subjectId
      element.fileName
      element.mockTestSection.duration  
      if(this.isSectionBased=="true" && element.mockTestSection.duration==undefined){
        this.notify.info(this.l('Please fill the required fields.'));
        this.isCheck=true;
        this.loading=false;
        
      }
      if(element.mockTestSection.subjectId == null  || element.mockTestSection.subjectId == -1 || element.fileName ==null){
        this.notify.info(this.l('Please fill the required fields.'));
        this.isCheck=true;
        this.loading=false;
      }
      else if(this.isSectionBased=="true" && element.mockTestSection.duration== 0 ){
        this.notify.info(this.l("Duration can't be 0"));
        this.isCheck=true;
        this.loading=false;
      }
     else if(this.isSectionBased=="true" && element.mockTestSection.duration==undefined){
        this.notify.info(this.l('Please fill the required fields.'));
        this.isCheck=true;
        this.loading=false;
        
      }
    },(err)=>{
      this.loading=false;
    });
    if(!this.isCheck){
      this.notify.info(this.l('Questions Added'));
      var obj = { allQuestions: this.allQuestions, items: this.createmockTestDto.mockTestSection, questions: this.questions }
      this.createmockTestDto.mockTestSection = [];
      this.questions.forEach(element => {
        this.createmockTestDto.mockTestSection.push(element.mockTestSection)
      });
      obj.items = this.createmockTestDto.mockTestSection;
      this.onSave.emit(obj);
      this.bsModalRef.hide();
   
      
    }
  } 
  cancel() {
    this.bsModalRef.hide();
    this.questions = [];
  }
  onFileUpload(file, index) {

    this.questions[index].isFileUpladedStatus = 'start';
    if (file) {
      this.loading = true;
      file = {
        fileName: file[0].name,
        data: file[0]
      };
      this.fileName = file.fileName
      this.questionService.previewQuestion(file).subscribe(res => {
        res=res.filter(x=>x.questions!=null);
        res.forEach(element => {
          element.topics = this.questions[index].topics != null ? this.allTopics.filter(q => this.questions[index].topics.map(a => a.id).includes(q.id)) : [];
          element.subjectId = this.questions[index].mockTestSection.subjectId;
          element.fileName = this.fileName;
        });
        this.allQuestions.push(res);
        this.questions[index].isFileUpladedStatus = 'end';
        this.questions[index].fileName=this.fileName;
        if (this.fileName != null ) {
        this.loading = false;
          this.notify.success("File uploaded successfully......")
        }
         },(err)=>{
         this.loading=false;
  
      });
      }
  }
  getAllSubjects() {
    this._subjectService.getAll("", 0, 1000).subscribe(
      res => {
        this.allSubject = res.items;
      })
  }
  getAllTopics(event) {
    this._topicService.getTopicsBasedOnSubject([event.currentTarget.value]).subscribe(
      res => {
        this.allTopics = res;
        
       
      })
  }
  changeSubject(index,element){
    if(this.questions[index]!=null && this.questions[index].fileName!=null){
      this.allQuestions.splice(index,1);
      element.value="";
    }
    
  }

}
export class AddQuestion {
  isFileUpladedStatus: string
  mockTestSection: MockTestSectionDto = new MockTestSectionDto();
  subjectId: number;
  topics: any[];
  fileName: string;
}