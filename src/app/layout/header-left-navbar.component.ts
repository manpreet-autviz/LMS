import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { CommonService } from '@shared/helpers/common.service';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'header-left-navbar',
  templateUrl: './header-left-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderLeftNavbarComponent implements OnInit {
  sidebarExpanded: boolean;
  data: any;
  constructor(private _layoutStore: LayoutStoreService,
    private commonService: CommonService,private changeDetector:ChangeDetectorRef, private renderer: Renderer2,
    private router: Router) { }

  ngOnInit(): void {
    
    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
    });
    this.commonService.pageTitle.subscribe(res => {
      this.data = res;
      this.changeDetector.detectChanges();
    })
  }
  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
    this.renderer.removeClass(document.body, 'sidebar-hide-mock');
    if(this.router.url.includes("app/student/mock-test")){
      if(this.sidebarExpanded){
        this.renderer.removeClass(document.body, 'sidebar-hide-mock');
      }
    else{
      const bodyTag = document.body;
      bodyTag.classList.add('sidebar-hide-mock');
    }
  }
  }
  
}
