import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { BlogAppServicesServiceProxy, BlogsDto } from '@shared/service-proxies/service-proxies';
import { Location } from '@angular/common';

@Component({
  selector: 'app-daily-feed',
  templateUrl: './daily-feed.component.html',
  styleUrls: ['./daily-feed.component.scss']
})
export class DailyFeedComponent extends AppComponentBase implements OnInit {
   newdaily : BlogsDto = new BlogsDto();
   loading= false;
   data:any=[];
   activeTab:any;
   constructor(injector : Injector, private location:Location,  private _router:ActivatedRoute, private _blogAppService: BlogAppServicesServiceProxy,private commonService:CommonService) {
    super(injector)
   }


  ngOnInit(): void {
    this._router.params.subscribe(params => {
      this.activeTab = params.tab;
    });
    var navContent = { title: "Daily Feeds", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
   // this.getalldata(this.newdaily);
  }
   getalldata(){
    this.loading=true;
    this._blogAppService.getAllBlogs(0).subscribe(res => {
    this.loading=false;
       
   },(err)=>{
    this.loading=false;
  });
  }

  checkActive(tab) {
    if (tab == 'daily-quiz') {
      this.location.go("app/student/daily-feed/daily-quiz")
    }
    else if(tab == 'current-affairs') {
      this.location.go("app/student/daily-feed/current-affairs")
    }
      else{
        this.location.go("app/student/daily-feed/video")
      }
  }

}  
