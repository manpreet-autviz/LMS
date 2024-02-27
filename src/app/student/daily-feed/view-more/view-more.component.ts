import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogAppServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.scss']
})
export class ViewMoreComponent implements OnInit {
  blog: any;
  blogDetails: any;
  constructor(private route: ActivatedRoute, public _modalService: BsModalRef, private _blogAppService: BlogAppServicesServiceProxy) { }

  ngOnInit(): void {
    this.blogDetails = this.blog;
  }

  back() {
    this._modalService.hide();
  }
  setHeight() {
    return window.innerHeight - (window.innerHeight * 0.2)
  }

}
