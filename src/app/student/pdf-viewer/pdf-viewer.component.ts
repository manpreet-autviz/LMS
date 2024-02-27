import { AfterViewInit, Component, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ContentManagementNotesDto, ContentManagementServiceServiceProxy, JobNotificationDto, JobNotificationServiceServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit, AfterViewInit {
  notes: ContentManagementNotesDto = new ContentManagementNotesDto();
  jobNoti: JobNotificationDto = new JobNotificationDto();
  link = "";
  id: number;
  notesUrl: any;
  loading = false;
  constructor(private route: ActivatedRoute, private _contentNotesService: ContentManagementServiceServiceProxy, private _jobNotificationService: JobNotificationServiceServiceProxy) { }
  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.getDataFromContentNotes(this.id);
    });
  }

  ngOnInit(): void {
    this.getDataFromContentNotes(this.notes.id);
  }

  getDataFromContentNotes(id: any) {
    
    this.loading = true;
    this._contentNotesService.getContentNotesData(id).subscribe(res => {
      this.notesUrl = res.notesUrl;
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
   
  }



}
