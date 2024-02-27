import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { BlogAppServicesServiceProxy, BlogsDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ViewMoreComponent } from '../view-more/view-more.component';

@Component({
  selector: 'app-current-affairs',
  templateUrl: './current-affairs.component.html',
  styleUrls: ['./current-affairs.component.scss']
})
export class CurrentAffairsComponent extends AppComponentBase implements OnInit {
  dailyFeed: BlogsDto = new BlogsDto();
  allFeeds: any = [];
  subjectId: number;
  courseId: number;
  readMore: any = [false];
  loading = false;
  constructor(injector: Injector, private _blogAppService: BlogAppServicesServiceProxy, private _modalService: BsModalService,
    private router: Router) {
    super(injector)
  }

  ngOnInit(): void {
    this.getAllFeed();
  }
  getAllFeed() {
    this.loading = true;
    this._blogAppService.getAllBlogs(0).subscribe(res => {
      this.allFeeds = res.filter(res => res.type == "Current Affairs");
      this.loading = false;
    },(err)=>{
      this.loading=false;
    });
  }

  showDetail(blog: any) {
    let detail: BsModalRef;
    detail = this._modalService.show(
      ViewMoreComponent,
      {
        keyboard: false,
        class: 'modal-xl  modal-dialog-centered',
        initialState: {
          blog: blog
        },
      });
      
  }

  // showText(index: number) {
  //   
  //   this.readMore[index] = true;
  // }

  // showLessText(index: number) {
  //   
  //   this.readMore[index] = false;
  // }

  back() {
    this.router.navigate(['/app/student/dashboard'])
  }
}
