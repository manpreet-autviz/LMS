import { Component, Injector, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AdminDashboardDto, AdminDashBoradServiceServiceProxy, SessionServiceProxy, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as moment from 'moment';
import { CommonService } from '@shared/helpers/common.service';
import { runInThisContext } from 'vm';
import { IfStmt } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends AppComponentBase implements AfterViewInit, OnDestroy {
  roles: any;
  user:UserDto = new UserDto();
  id: any;
  userId: number;
  check=true
  loading=false;
  isResulted = false;

  constructor(public router:Router, public injector: Injector,private _sessionService:SessionServiceProxy, private _userService:UserServiceProxy, private common: CommonService, private admindashboardService: AdminDashBoradServiceServiceProxy, private userService: UserServiceProxy
    ,public changedetect :ChangeDetectorRef) {
    super(injector);
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }
  ngAfterViewInit(): void {

  }
  

   ngOnInit(): void {
     var navContent = { title: "Dashboard", lengthh: "-1" }

     this.common.pageTitle.next(navContent)
     this.getStudent();
   }

   getStudent() {
    this._sessionService.getCurrentLoginInformations().subscribe(res => {
    this.userId = res.user.id;
    this.getUserbyRoles();
  })
 }

   getUserbyRoles(){
    this.loading=true
    this._userService.get(this.userId).subscribe(res=>{
      this.user=res
      this.roles=res.roleNames;
      this.isResulted = true;
      
      if(this.roles.includes('STUDENT')){
        this.router.navigate(['app/student/dashboard'])
      }
      else if(this.roles.includes('TEACHER'))
      {
        this.router.navigate(['admin/category'])
      }
      else{
        this.checkRole();
        this.loading=false;
      }
      this.changedetect.detectChanges();
      
    },(err)=>{
      this.loading=false;
    });
   }
   
   checkRole(){
    if(this.roles=='ADMIN'){
       this.check=true;
    }
    else{
      this.check=false;
    }
  }
 
}
