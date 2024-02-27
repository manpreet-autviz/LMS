import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from '@shared/helpers/common.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-mock',
  templateUrl: './my-mock.component.html',
  styleUrls: ['./my-mock.component.scss']
})
export class MyMockComponent implements OnInit {
  activeTab: any;
  constructor(private location: Location, private commonService: CommonService, private _router: ActivatedRoute) { }

  ngOnInit(): void {
    this._router.params.subscribe(params => {
      this.activeTab = params.tab;
    });
    var navContent = { title: "Mock Test", lengthh: "-1" }
    this.commonService.pageTitle.next(navContent)
  }
  checkActive($event) {
    if ($event.heading == 'Upcoming') {
      this.location.go("app/student/mock/upcoming")
    }
    else {
      this.location.go("app/student/mock/my-mock")
    }

  }
}
