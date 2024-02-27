import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveClassStudentRoutingModule } from './live-class-student-routing.module';
import { LiveClassStudentComponent } from './live-class-student.component';
import { PlyrModule } from 'ngx-plyr';

@NgModule({
  declarations: [
    LiveClassStudentComponent
  ],
  imports: [
    CommonModule,
    LiveClassStudentRoutingModule,
    PlyrModule
  ]
})
export class LiveClassStudentModule { }
