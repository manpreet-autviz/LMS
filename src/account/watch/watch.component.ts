import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@shared/helpers/common.service';
import { PlyrComponent } from 'ngx-plyr';


@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit , AfterViewInit{
  videoUrl: string;
  videoSources: Plyr.Source[] = [];

  constructor(private route: ActivatedRoute , private common : CommonService) { }
  ngAfterViewInit(): void {
   
  }


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

  url : any;
  // videoSources: Plyr.Source[] = [
  //   {
  //     src: 'CtAILwwD_Nk',
  //     provider: 'youtube',
  //   },
  //   // Add more video sources if needed
  // ];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.videoUrl = params['url'];
      this.videoSources = [
        {
          src: this.videoUrl,
          provider: 'youtube',
        }
      ];
    });
    
    
  }
    


}
  


