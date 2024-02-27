import {
  AfterViewInit,
  Component,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  ContentManagementServiceServiceProxy,
  ContentManagementVideosDto,
  CreateContentManagementDto,
  SubjectServiceServiceProxy,
  TopicsServiceProxy,
} from "@shared/service-proxies/service-proxies";
import * as moment from "moment";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-edit-video",
  templateUrl: "./edit-video.component.html",
  styleUrls: ["./edit-video.component.scss"],
})
export class EditVideoComponent
  extends AppComponentBase
  implements OnInit, AfterViewInit , OnDestroy{
  @Output() onSave = new EventEmitter<any>();
  createContentManDto: CreateContentManagementDto =
    new CreateContentManagementDto();
  videosArray: any = [];
  subjects: any[] = [];
  subjectId: any;
  videos: any = [];
  allSubjectItems: any = [];
  public startDate: any = [];
  id: any;
  allTopics: any = [] = [];
  ischeck: boolean = false;
  contentVideo: ContentManagementVideosDto = new ContentManagementVideosDto();
  price: any;
  dateRange = moment(new Date()).format("YYYY-MM-DD");
  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _contentService: ContentManagementServiceServiceProxy,
    private _subService: SubjectServiceServiceProxy,
    private _topicService: TopicsServiceProxy
  ) {
    super(injector);
  }
  ngOnDestroy(): void {
    if(this.videos !=null){
      this.videos.forEach(element => {
        if (element.isLive) {
         element.startDate = moment(element.startDate);
        }
      });

    }
  }
  ngAfterViewInit(): void {
    if (this.videos?.length > 0) {
      this.videosArray = this.videos.reduce((result, currentValue) => {
        const subjectIndex = result.findIndex((item) => item[0].subjectId === currentValue.subjectId);
        if (subjectIndex !== -1) {
          result[subjectIndex].push(currentValue);
        } else {
          result.push([currentValue]);
        }
        return result;
      }, []);
      const uniqueArray = this.videos.reduce((result, currentValue) =>
        result.some((item) => item.subjectId === currentValue.subjectId) ? result : [...result, currentValue],
        []
      );
      this.subjects = uniqueArray;
      this.subjects.forEach((subject, j) => {
        this._topicService.getTopicsBySubject(subject.subjectId).subscribe(res => {
          this.allTopics[j] = res;
        });
      });
      this.videos.forEach(element => {
        if (element.isLive && element.startDate!=null) {
          element.startDate = moment(element.startDate).format('YYYY-MM-DD');
        }
        
      });
    }
    else {
      this.add(0);
    }
  }

  deleteSubject(index: number, j){
    this.videosArray[j].splice(index, 1);
    this.subjects.splice(index, 1);
  }
  ngOnInit(): void {
    this.price = JSON.parse(localStorage.getItem('EditContentCoursPrice'))

    this.getAllSubjects();
  }
  getAllSubjects() {
    this._subService.getAll('', 0, 100).subscribe(res => {
      this.allSubjectItems = res.items;
    })
  }
  add(indexj) {
    var contentManagementVideo = new ContentManagementVideosDto();
    contentManagementVideo.videoUrl = ''
    if (this.videosArray[indexj] == null) {
      this.videosArray[indexj] = [];
      contentManagementVideo.subjectId = -1
      this.subjects.push(contentManagementVideo)
    }
    contentManagementVideo.topicsId = -1
    this.videosArray[indexj].push(contentManagementVideo);

    this.startDate.push({ date: '' })
  }

  addmore(j) {
    var contentManagementVideo = new ContentManagementVideosDto();
    if (this.videosArray[j + 1] == null) {
      this.videosArray[j + 1] = [];
    }
    this.videosArray[j + 1].push(contentManagementVideo);
    contentManagementVideo.subjectId = -1
    contentManagementVideo.topicsId = -1
    this.subjects.push(contentManagementVideo)
    this.startDate.push({ date: '' })
  }

  delVideo(index: number, j) {
    this.videosArray[j].splice(index, 1);
    if (j >= 1 && index === 0) {
      this.subjects.splice(j, 1);
    }
  }

 
  submit() {
    this.ischeck = false;
    var i = 0
    this.videosArray.forEach(element => {
      element.forEach(element => {
        element.subjectId = this.subjects[i].subjectId
      });
      i = i + 1;
    });
    this.createContentManDto.contentManagementVideos = []
    this.createContentManDto.contentManagementVideos = Array.prototype.concat.apply([], this.videosArray);
    this.createContentManDto.contentManagementVideos.forEach((element) => {
      element.startDate;
      element.startTime;
      element.isFree;
      element.isLive;

      if(element.startDate!=null){
  
        element.startDate = moment(element.startDate)
      }

      var validpattern = element.videoUrl.match(
        "^(http(s)?://)?((w){3}.)?youtu(be|.be)?(.com)?/.+"
      );
      if (element.videoUrl == null || element.videoUrl == "") {
        this.notify.info(this.l("Please fill the required fields "));
        this.ischeck = true;
      } else if (validpattern == null) {
        this.notify.error(this.l("Please enter valid youtube video url"));
        this.ischeck = true;
      } else if (element.title == null || element.title == "") {
        this.notify.info(this.l("Please fill the required fields "));
        this.ischeck = true;
      }
      else if (element.subjectId == null || element.subjectId == undefined) {
        this.notify.info(this.l("Please fill the required fields "));
        this.ischeck = true;
      }

    });
    if (!this.ischeck) {
      this.notify.info(this.l("Videos Added"));
      this.onSave.emit(this.createContentManDto.contentManagementVideos);
      this.bsModalRef.hide();
    }
  }
  cancel() {
    this.bsModalRef.hide();
  }
  setDate(index, data) {
    this.createContentManDto.contentManagementVideos = Array.prototype.concat.apply([], this.videosArray);
    if (data.isLive && this.startDate[index].date != "") {
      this.createContentManDto.contentManagementVideos[index].startDate =
        moment(this.startDate[index].date)
          .add("5", "hours")
          .add("30", "minutes");
         this.createContentManDto.contentManagementVideos[index].startDate.format("YYYY-MM-DD") 
    } else {
      this.createContentManDto.contentManagementVideos[index].startDate =
        undefined;
    }
  }
  getTopicsBySubjectId(id: any, j) {
    this.videosArray[j].forEach(video => video.topicsId = -1);
    this._topicService.getTopicsBySubject(id).subscribe(res => {
      this.allTopics[j] = res
    });
  }
  
}
