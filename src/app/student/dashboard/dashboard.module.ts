import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { SwiperModule } from "swiper/angular";
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { PlyrModule } from 'ngx-plyr';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
     CommonModule, FormsModule, SwiperModule,
     TreeTableModule,
    TreeSelectModule,
    PlyrModule

  ]
})
export class DashboardModule { }
