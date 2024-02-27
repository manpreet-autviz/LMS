import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import {  ContentManagementVideosDto,  CourseManagementAppServicesServiceProxy,  SessionServiceProxy,  StudentLiveClassesDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-live-classes',
  templateUrl: './live-classes.component.html',
  styleUrls: ['./live-classes.component.scss']
})
export class LiveClassesComponent extends AppComponentBase implements OnInit {
  courseManagement: StudentLiveClassesDto = new StudentLiveClassesDto();
  loading = false;
  studentId:any
  vids:any=[]
  courseManagements:any=[];
  result:any=[];
  constructor(injector : Injector, private _sessionService: SessionServiceProxy,private commonService:CommonService,private _courseService: CourseManagementAppServicesServiceProxy, public router : Router) {
    super(injector)
   }
  ngOnInit(): void {
    var navContent = { title: "Live Classes", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
    this.getStudent();
  }

  getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe(res => {
    this.studentId = res.user.id;
    this.getStudentLiveClasses();
  })
 }

  getStudentLiveClasses(){
    this.loading=true;
    this._courseService.getStudentLiveClasses(this.studentId).subscribe(res=>{
    this.courseManagements = res;
    this.loading=false;
        },(err)=>{
          this.loading=false;
        });
  }
  getVideoId(url) {
    var id = "";
    if (Boolean(url) && url.includes('v=')) {
      id = url.split("v=")[1];
      if(id!=null){
        return id.includes("&") ? id.split("&")[0] : id;
      }
    }
    else{
      var arrayUrl = url.split('/')
      if(arrayUrl.length>3){
        id= arrayUrl[arrayUrl.length-1].split('?')[0]
      }
      else{
        id = arrayUrl[arrayUrl.length-1];
      }
    }
    return id;
  }


  start(videoId:any){
    this.router.navigateByUrl('/app/student/student-live/'+videoId )
  }
  
}