import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCourseComponent } from './my-course.component';
import { BuyCourseComponent } from './buy-course/buy-course.component';
import { MyCourseRoutingModule } from './my-course.routing.module';
import { CourseListComponent } from './course-list/course-list.component';
import { RouterModule } from '@angular/router';
import { AllCourseComponent } from './course-list/all-course/all-course.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CourseViewComponent } from './course-list/course-view/course-view.component';
import { SharedModule } from '@shared/shared.module';
import { CourseQuizComponent } from './buy-course/course-quiz/course-quiz.component';
import { CourseVideosComponent } from './buy-course/course-videos/course-videos.component';
import { CourseNotesComponent } from './buy-course/course-notes/course-notes.component';
import { CourseQuestionsComponent } from './buy-course/course-questions/course-questions.component';
import { ViewCourseComponent } from './view-course/view-course.component';
import { TreeSelectModule } from 'primeng/treeselect';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [
    MyCourseComponent,
    BuyCourseComponent,
    CourseListComponent,
    AllCourseComponent,
    CourseViewComponent,
    CourseQuizComponent,
    CourseVideosComponent,
    CourseNotesComponent,
    CourseQuestionsComponent,
    ViewCourseComponent
    ],
  imports: [
    CommonModule,
    MyCourseRoutingModule,
    TabsModule,
    SharedModule.forRoot(),
    TreeSelectModule,
    FormsModule,
    
  ],
  providers:[BsModalRef ]
})
export class MyCourseModule { }

