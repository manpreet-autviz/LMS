import { Component, HostListener, Injector, OnInit, Renderer2, VERSION } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { CommonService } from '@shared/helpers/common.service';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
 

@Component({
  templateUrl: './app.component.html'
})

export class AppComponent extends AppComponentBase implements OnInit {
  sidebarExpanded: boolean;

  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService,
    private _commonService: CommonService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._commonService.loadChatbot();
    abp.multiTenancy.setTenantIdCookie(1);
    this.renderer.addClass(document.body, 'sidebar-mini');

    SignalRAspNetCoreHelper.initSignalR();

    abp.event.on('abp.notifications.received', (userNotification) => {
      abp.notifications.showUiNotifyForUserNotification(userNotification);

      // Desktop notification
      Push.create('AbpZeroTemplate', {
        body: userNotification.notification.data.message,
        icon: abp.appPath + 'assets/app-logo-small.png',
        timeout: 6000,
        onClick: function () {
          window.focus();
          this.close();
        }
      });
    });

    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
    });
  }
  
 

  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }
}
