import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@shared/helpers/common.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.css']
})
export class MyCourseComponent implements OnInit {
  activeTab: any;

  constructor(private common: CommonService,
    private location: Location,
    private _router: ActivatedRoute) { }

  ngOnInit(): void {
    this._router.params.subscribe(params => {
      this.activeTab = params.tab;
    });
    var navContent = { title: "My Course", lengthh: -1 }
    this.common.pageTitle.next(navContent)

  }
  checkActive($event) {
    if ($event.heading == 'All Course') {
      this.location.go("app/student/my-course/my-course")
    }
    else {
      this.location.go("app/student/my-course/my-course")
    }

  }
}
