import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '@shared/helpers/common.service';
import { JobNotificationDto, JobNotificationServiceServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-job-notification',
  templateUrl: './job-notification.component.html',
  styleUrls: ['./job-notification.component.scss']
})
export class JobNotificationComponent implements OnInit {
  allData:any=[];
  jobs:JobNotificationDto=new JobNotificationDto();
  notesUrl: any;
  loading=false;
  constructor(private _jobNotiService:JobNotificationServiceServiceProxy,private router:Router,
    private commonService:CommonService,) { }

  ngOnInit(): void {
    this.getAllJobNotifications();

  }
getAllJobNotifications(){
  this.loading=true;
  this._jobNotiService.getAllJobs().subscribe(res=>{
    this.allData=res;
    var navContent = { title: "Job Notification", lengthh: this.allData.length }
    this.loading=false;
    this.commonService.pageTitle.next(navContent)
  },(err)=>{
    this.loading=false;
  });
}

getData(id: number){
  this._jobNotiService.get(id).subscribe(res=>{
    this.notesUrl=res.notesUrl;
  })
}
}
