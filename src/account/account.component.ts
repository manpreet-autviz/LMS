import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  Injector,
  Renderer2
} from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { AccountServiceProxy, IsTenantAvailableInput, IsTenantAvailableOutput } from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountComponent extends AppComponentBase implements OnInit {
  tenancyName: any;
  constructor(injector: Injector, private renderer: Renderer2,private _accountService: AccountServiceProxy, private _common : CommonService) {
    super(injector);
  }
  

  showTenantChange(): boolean {
    return abp.multiTenancy.isEnabled;
  }

  ngOnInit(): void {
this._common.loadChatbot()
    this.renderer.addClass(document.body, 'login-page');
    this.save();
  }

  save(): void {
      abp.multiTenancy.tenantIdCookieName = "Abp-TenantId";
      abp.multiTenancy.setTenantIdCookie(1);
      return;
  }
}
