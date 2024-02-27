import { AfterViewInit, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonServiceServiceProxy, ContentManagementDto, ContentManagementNotesDto, ContentManagementServiceServiceProxy, CreateContentManagementDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-notes',
  templateUrl: './edit-notes.component.html',
  styleUrls: ['./edit-notes.component.scss']
})
export class EditNotesComponent extends AppComponentBase implements OnInit , AfterViewInit {
  @Output() onSave = new EventEmitter<any>();
  createContentManDto: CreateContentManagementDto = new CreateContentManagementDto();
  id:any;
  notes: any = [];
  isImageUpladedStatus: string;
  ischeck:boolean=false;
  constructor(public commonService:CommonServiceServiceProxy,injector: Injector, public bsModalRef: BsModalRef,private _contentService:ContentManagementServiceServiceProxy) { super(injector) }
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
    if (this.createContentManDto.contentManagementNotes == null) {
      this.createContentManDto.contentManagementNotes = [];
    }

    this.createContentManDto.contentManagementNotes.push(contentManagementNotes)
  }
  delNote(index: number) {
    this.createContentManDto.contentManagementNotes.splice(index, 1)
  }
  submit() {
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
