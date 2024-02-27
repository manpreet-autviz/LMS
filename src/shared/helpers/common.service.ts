import { Injectable } from '@angular/core';
import { BlogsDto, CreateBlogsDto, CreateMockTestDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  questionsIds=[];
  craeteBlog : BlogsDto = new BlogsDto();
  createMockTest:CreateMockTestDto=new CreateMockTestDto();
  addQuestions: any = [];
  mockTestSectionDurations: any = [];
  questions: any[] = [];
  constructor() { }
  private commonfilters: any = new Subject();
  commonFilters = this.commonfilters.asObservable();

  commonChanges() {
    this.commonfilters.next();
  }
  pageTitle = new BehaviorSubject<any>(null);


  private scriptInjected = false;

  injectScript(value) {    
    this.scriptInjected = value;
    if (!this.scriptInjected) {
      const s1 = document.createElement("script");
      s1.async = true;
      s1.src = 'https://embed.tawk.to/64830817cc26a871b0218b45/1h2ftf7ut';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      document.body.appendChild(s1);
      this.scriptInjected = true;
    }
  }

  removeScript(value) {
    this.scriptInjected = value;
    if (this.scriptInjected) {
      const scriptElement = document.getElementsByClassName("widget-visible")
      if (scriptElement.length > 0) {
        for (let i = 0; i < scriptElement.length; i++) {
          const element = scriptElement[i] as HTMLElement;
          element.style.display = "none";
          element.style.setProperty("display", "none", "important");
        }
        this.scriptInjected = false;
      }
    }
  }


  private scriptElement: HTMLScriptElement | null = null;

  loadChatbot(): void {
  if (!window.location.href.includes('/account/watch')) {
    this.scriptElement = document.createElement('script');
    this.scriptElement.src = 'https://embed.tawk.to/64830817cc26a871b0218b45/1h2ftf7ut';
    this.scriptElement.charset = 'UTF-8';
    this.scriptElement.setAttribute('crossorigin', '*');
    document.body.appendChild(this.scriptElement);
  }
  }

  unloadChatbot(): void {
      this.scriptElement.remove();
      this.scriptElement = null;
    
  }
}
