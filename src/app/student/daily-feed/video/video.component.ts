import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BlogAppServicesServiceProxy, BlogsDto } from '@shared/service-proxies/service-proxies';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PlyrComponent } from 'ngx-plyr';
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent extends AppComponentBase implements OnInit {
  @ViewChild(PlyrComponent, { static: true })
  allFeeds:any=[];
  blogDto : BlogsDto = new BlogsDto();
  loading =false;
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
  constructor(injector : Injector, public router: Router,private _blogAppService: BlogAppServicesServiceProxy,public sanitizer: DomSanitizer) {
    super(injector)
   }
   urlSafe: SafeResourceUrl;

  ngOnInit(): void {
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.blogDto.fileName)
    this.getAllFeed();

  }
  getAllFeed(){
     this.loading=true;
    this._blogAppService.getAllBlogVideos().subscribe(res => {
       this.allFeeds = res

       this.allFeeds.forEach(element => {
        element["source"]= [{
          src: element.fileName,
          provider: 'youtube',
        }]
       });
       this.loading=false;
   },(err)=>{
    this.loading=false;
  });
  }
  
  back(){
    this.router.navigate(['/app/student/dashboard'])

  }
}

