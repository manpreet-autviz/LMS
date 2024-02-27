import { Component, OnInit } from '@angular/core';
import { CommonService } from '@shared/helpers/common.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent  implements OnInit {
  activeTab: any;
  constructor(private common:CommonService, private location: Location, private _router: ActivatedRoute) { }

  ngOnInit(): void {
    this._router.params.subscribe(params => {
      this.activeTab = params.tab;
    });
     var navContent = { title: "My Course", lengthh: -1 }
    this.common.pageTitle.next(navContent)
    this.getAll();
  }
  getAll(){

  }

  checkActive($event) {
    if ($event.heading == 'All Course') {
      this.location.go("app/student/my-course/list/all-course")
    }
    else {
      this.location.go("app/student/my-course/list/my-course")
    }

  }
}
