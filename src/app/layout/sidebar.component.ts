import {
  Component,
  ChangeDetectionStrategy,
  Renderer2,
  OnInit
} from '@angular/core';
import { LayoutStoreService } from '@shared/layout/layout-store.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  sidebarExpanded: boolean=false;

  constructor(
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService
  ) {}

  ngOnInit(): void {
    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
      this.toggleSidebar();
    });
  }

  toggleSidebar(): void {
    if (this.sidebarExpanded) {
      document.getElementsByClassName('content-wrapper')[0].classList.remove('custom-witdh-contetntWraper')
      document.getElementsByClassName('main-header')[0].classList.remove('custom-witdh-contetntWraper')
      document.getElementsByClassName('main-footer')[0].classList.remove('custom-witdh-contetntWraper')
      this.hideSidebar();
    } else {
      this.showSidebar();
      document.getElementsByClassName('content-wrapper')[0].classList.add('custom-witdh-contetntWraper')
      document.getElementsByClassName('main-header')[0].classList.add('custom-witdh-contetntWraper')
      document.getElementsByClassName('main-footer')[0].classList.add('custom-witdh-contetntWraper')
    }
  }

  showSidebar(): void {
    this.renderer.removeClass(document.body, 'sidebar-collapse');
    this.renderer.addClass(document.body, 'sidebar-open');
  }

  hideSidebar(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-collapse');
  }
}
