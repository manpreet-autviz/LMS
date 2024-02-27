import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BlogAppServicesServiceProxy, BlogsDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss']
})
export class VocabularyComponent extends AppComponentBase implements OnInit {
  dailyFeed : BlogsDto = new BlogsDto();
  Feed:any=[];
  constructor(injector : Injector, private _blogAppService: BlogAppServicesServiceProxy) {
    super(injector)
   }

  ngOnInit(): void {
    this.getAllFeed();
  }
  getAllFeed(){
    this._blogAppService.getAllBlogs(0).subscribe(res => {
       this.Feed = res.filter(res=>res.type=="Vocabulary");
   })
  }

}
