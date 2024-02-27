import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { RouterModule } from '@angular/router';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from '@shared/shared.module';
import { GeneralInstruction2Component } from './general-instruction2/general-instruction2.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MathModule } from 'math/math.module';
import { StartfreeTrialComponent } from './startfree-trial/startfree-trial.component';






@NgModule({
  declarations: [
    StudentComponent,
    StudentProfileComponent,
    GeneralInstruction2Component,
    StartfreeTrialComponent,

  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    SwiperModule,
    SharedModule,
    PdfViewerModule,
    MathModule,
    

  ],
  providers:[]
})
export class StudentModule { }
