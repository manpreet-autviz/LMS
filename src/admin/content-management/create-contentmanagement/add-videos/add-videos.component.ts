import { number } from '@amcharts/amcharts4/core';
import { AfterViewInit, Component, EventEmitter, Injector, OnDestroy, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ContentManagementDto, ContentManagementVideosDto, CourseManagementAppServicesServiceProxy, CreateContentManagementDto, SubjectDto, SubjectServiceServiceProxy, TopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { debug } from 'console';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-videos',
  templateUrl: './add-videos.component.html',
  styleUrls: ['./add-videos.component.scss']
})
export class AddVideosComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
  @Output() onSave = new EventEmitter<any>();
  videosArray: any = [];
  subjects: any[] = [];
  ischeck: boolean = false;
  allSubjectItems: any = [];
  startDate: any
  loading = false;
  allCourses: any = [];
  price: any;
  selectedSubjectIds: number[] = [];
  createContentManDto: CreateContentManagementDto = new CreateContentManagementDto();
  videos: any = [];
  contentMang: ContentManagementDto = new ContentManagementDto();
  contentVideo: ContentManagementVideosDto = new ContentManagementVideosDto();
  addMuldata: ContentManagementVideosDto = new ContentManagementVideosDto();
  subjectId: any;
  allsubjectdata: CreateContentManagementDto = new CreateContentManagementDto();
  allTopics: any = [] = [];
  dateRange = moment(new Date()).format("YYYY-MM-DD");
  contentManagementVideos = [{ values: "" }]
  isAddMoreClicked = false;
  minDate = new Date();
  currentIndex: number;
  constructor(injector: Injector,
    private _courseService: CourseManagementAppServicesServiceProxy,
    public bsModalRef: BsModalRef, private _subService: SubjectServiceServiceProxy,
    private _topicService: TopicsServiceProxy) { super(injector) }

  ngOnDestroy(): void {
    if (this.videos != null) {
      this.videos.forEach(element => {
        if (element.isLive) {
          element.startDate = moment(element.startDate);
          this.selectedSubjectIds = element.subjectId
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
        this.selectedSubjectIds = subject.subjectId
        this._topicService.getTopicsBySubject(subject.subjectId).subscribe(res => {
          this.allTopics[j] = res;
        });
      });
      this.videos.forEach(element => {
        element.topicId = element.topicId
        if (element.isLive) {
          element.startDate = moment(element.startDate).format('YYYY-MM-DD');
        }
      });
    }
    else {
      this.add(0);
    }
  }
  ngOnInit(): void {

    this.price = JSON.parse(localStorage.getItem('coursePrice'))
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
      contentManagementVideo.topicsId = -1
      this.subjects.push(contentManagementVideo)
    }
    contentManagementVideo.topicsId = -1
     this.videosArray[indexj].push(contentManagementVideo);
  }
  addmore(j) {
  var contentManagementVideo = new ContentManagementVideosDto();
    contentManagementVideo.startDate = moment()
    if (this.videosArray[j] == null) {
      this.videosArray[j] = [];
    }
    contentManagementVideo.topicsId = -1
    this.videosArray[j].push(contentManagementVideo);
    contentManagementVideo.subjectId = -1

    this.subjects.push(contentManagementVideo)
    this.isAddMoreClicked = true;
  }

  delVideo(index: number, j)
   {
      this.videosArray[j].splice(index, 1);
    if (j >= 1 && index === 0) {
      this.subjects.splice(j, 1);
    }
}
submit() {
    this.ischeck = false;
    this.loading = true;
    var i = 0

    this.videosArray.forEach(element => {
      element.forEach(element => {
        element.subjectId = this.subjects[i].subjectId
      });
      i = i + 1;
    });
    this.createContentManDto.contentManagementVideos = []
    this.createContentManDto.contentManagementVideos = Array.prototype.concat.apply([], this.videosArray);
    this.createContentManDto.contentManagementVideos.forEach(element => {
      if (element.startDate != null) {
         element.startDate = moment(element.startDate)
      }
      element.startTime
      element.isFree
      element.isLive
      var validpattern = element.videoUrl.match('^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+')
      if (element.videoUrl == null || element.videoUrl == "") {

        this.notify.info(this.l('Please fill the required fields '));
        this.ischeck = true;
      }
      else if (validpattern == null) {
        this.notify.error(this.l('Please enter valid youtube video url'));
        this.ischeck = true;
      }
      if (element.title == null || element.title == "") {
        this.notify.info(this.l('Please fill the required fields '));
        this.ischeck = true;
      }
      else if (element.subjectId == null || element.subjectId == undefined) {
        this.notify.info(this.l('Please fill the required fields '));
        this.ischeck = true;
      }

    })
    if (!this.ischeck) {
      this.notify.info(this.l('Videos Added'));
      this.loading = false;
      this.onSave.emit(this.createContentManDto.contentManagementVideos);
      this.bsModalRef.hide();
    }
  }
  cancel() {
    this.bsModalRef.hide();
  }

  getTopicsBySubjectId(id: any, j) {
    this.videosArray[j].forEach(video => video.topicsId = -1);
    this._topicService.getTopicsBySubject(id).subscribe(res => {
      this.allTopics[j] = res
    });
  }
}