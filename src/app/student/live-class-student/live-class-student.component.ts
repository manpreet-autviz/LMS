import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@shared/helpers/common.service';
import { BlogAppServicesServiceProxy, BlogsDto, ContentManagementServiceServiceProxy, ContentManagementVideosDto, CourseManagementAppServicesServiceProxy, SessionServiceProxy, StudentLiveClassesDto } from '@shared/service-proxies/service-proxies';
import { cloneDeep } from 'lodash-es';
import { PlyrComponent } from 'ngx-plyr';
import { timeout } from 'rxjs/operators';



@Component({
  selector: 'app-live-class-student',
  templateUrl: './live-class-student.component.html',
  styleUrls: ['./live-class-student.component.scss'],
})
export class LiveClassStudentComponent implements OnInit {
  @ViewChild(PlyrComponent, { static: true })
  plyr: PlyrComponent;
  apiLoaded = false;
  data:ContentManagementVideosDto
  height = 0;
  width = 0;
  plyrOptions = {
    controls: [
      'play-large', // The large play button in the center
      //'restart', // Restart playback
      'rewind', // Rewind by the seek time (default 10 seconds)
      'play', // Play/pause playback
      'fast-forward', // Fast forward by the seek time (default 10 seconds)
      'progress', // The progress bar and scrubber for playback and buffering
      'current-time', // The current time of playback
      'duration', // The full duration of the media
      'mute', // Toggle mute
      'volume', // Volume control
      //'captions', // Toggle captions
      'settings', // Settings menu
      //'pip', // Picture-in-picture (currently Safari only)
      //'airplay', // Airplay (currently Safari only)
      //'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
      'fullscreen' // Toggle fullscreen
    ]
  }
  courseManagement: StudentLiveClassesDto = new StudentLiveClassesDto();
  blog : BlogsDto = new BlogsDto()
  loading = false;
  id: number
  studentId: any
  vidsURL: any 
  courseManagements: any = [];
  isVideoLoad : boolean=false;
  isCallFromBlogs:boolean;
  isCallFromDashboard:boolean;
  isCallFromViewCourse:boolean;
  isCallFromCourseVideos:boolean

  //ContentManagementVideos: ContentManagementVideosDto = new ContentManagementVideosDto();
  youtubeSources = [
    {
      src: '',
      provider: 'youtube',
    },
  ];
  videos: any = new ContentManagementVideosDto();
  videoUrl: ContentManagementVideosDto;
  constructor(private changeDetector: ChangeDetectorRef,private _blogService:BlogAppServicesServiceProxy, private common:CommonService,private route: ActivatedRoute, injector: Injector, private _contentService: ContentManagementServiceServiceProxy) { }

  ngOnInit(): void {
 
    this.route.params.subscribe(params => {
      this.id = params['id'];
      // if (localStorage.getItem("isCallFromLiveClasses")){
      //   this.isCallFromBlogs=false;
      //   this.getContentVideos(this.id);
      //  }
      //  if (localStorage.getItem("isCallFromBlogs")){
      //   this.isCallFromBlogs=true;
      //   this.getBlogVideo(this.id);
      //  }
      
      //  if (localStorage.getItem("isCallFromViewCourse")){
      //   this.isCallFromViewCourse=true;
      //   this.getContentVideos(this.id);
      //  }
      //  if (localStorage.getItem("isCallFromCourseVideos")){
      //   this.isCallFromCourseVideos=true;
      //   this.getContentVideos(this.id);
      //  }
    });
    this.getContentVideos(this.id);
  }

  // ngAfterViewInit(): void {
  //   localStorage.removeItem("isCallFromLiveClasses");
  //   localStorage.removeItem("isCallFromBlogs");
  //   localStorage.removeItem("isCallFromViewCourse");
  //   localStorage.removeItem("isCallFromCourseVideos");
  // }

  getVideo() {
    this._contentService.getVideoById(this.id).subscribe(res => {
      this.vidsURL = res.videoUrl; 
    })
  }

  // getBlogVideo(id:any){
  //   this._blogService.getBlogVideosData(id).subscribe(res=>{
  //     this.blog = res
  //     var navContent = { title:"Blogs Video", lengthh: "-1" }
  //     this.common.pageTitle.next(navContent)
  //     this.youtubeSources[0].src = res.fileName;
  //     this.isVideoLoad = true 
  //   })
  // }

  getContentVideos(id: any) {
    this._contentService.getContentVideosData(id, false).subscribe(res => {
      this.data = res;
      var navContent = { title: this.data.isLive?"Live Class":"Video", lengthh: "-1" }
      this.common.pageTitle.next(navContent)
      this.youtubeSources[0].src = res.videoUrl;
      this.isVideoLoad = true 
    })
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

}
