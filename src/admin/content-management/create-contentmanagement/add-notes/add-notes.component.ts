import { Component, Inject,EventEmitter, Injector, OnInit, Output, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonServiceServiceProxy, ContentManagementNotesDto, CreateContentManagementDto } from '@shared/service-proxies/service-proxies';
import { EditNotesComponent } from 'admin/content-management/edit-contentmanagement/edit-notes/edit-notes.component';
import { isNull } from 'lodash-es';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ContextMenuService } from 'primeng/api';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.scss']
})
export class AddNotesComponent extends AppComponentBase implements OnInit , AfterViewInit{
  @Output() onSave = new EventEmitter<any>();
  createContentManDto: CreateContentManagementDto = new CreateContentManagementDto();
  notes: any = [];
  toString=[];
  isImageUpladedStatus: string;
  showNotes: string;
  showFile:any=[];
  ischeck:boolean=false;
  constructor(injector: Injector, public bsModalRef: BsModalRef,public commonService:CommonServiceServiceProxy) { super(injector) }
  ngAfterViewInit(): void {
    
  
    if(this.notes?.length>0)
    {
      this.createContentManDto.contentManagementNotes = this.notes
    }
    else{
      this.addMultiNotes();
    }
  }

  ngOnInit(): void {
   

    
  }
  addMultiNotes() {
   
    var contentManagementNotes = new ContentManagementNotesDto();
    contentManagementNotes.notesUrl = ''
    if (this.createContentManDto.contentManagementNotes == null ) {
      this.createContentManDto.contentManagementNotes = [];
    }

    this.createContentManDto.contentManagementNotes.push(contentManagementNotes)
  }
  delNote(index: number) {
    this.createContentManDto.contentManagementNotes.splice(index, 1)
  }
  
   
  submit(){
  
    this.ischeck = false;
  this.createContentManDto.contentManagementNotes.forEach(element =>{
    element.title
    element.notesUrl
    if(element.title == null || element.title == "" || element.notesUrl ==''){
      this.notify.info(this.l('Please fill the required fields '));
      this.ischeck=true;
    }
  })
    if(!this.ischeck){
      this.notify.info(this.l('Notes Added'));
      this.onSave.emit(this.createContentManDto.contentManagementNotes);
      this.bsModalRef.hide();
    }
  }
   cancel() {
    this.bsModalRef.hide();
  }
  onUpload(file){
    if (file) {
      this.isImageUpladedStatus='start'
      file = {
        fileName: file[0].name,
        data: file[0]
      };
    }
    this.commonService.uploadImage(file).subscribe(res=>{
      this.isImageUpladedStatus='end'
      this.createContentManDto.contentManagementNotes[this.createContentManDto.contentManagementNotes.length-1].notesUrl =  res.saveLink
      this.createContentManDto.contentManagementNotes[this.createContentManDto.contentManagementNotes.length-1].showNotes = res.showLink
    })
  }

}

