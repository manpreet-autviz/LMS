
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { CreateComponent } from './admin/create/create.component';
import { EditComponent } from './admin/edit/edit.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AppRoutingModule } from '@app/app-routing.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { StudentsComponent } from './students/students.component';
import { CreateStudentComponent } from './students/create-student/create-student.component';
import { EditStudentComponent } from './students/edit-student/edit-student.component';
import { TeachersComponent } from './teachers/teachers.component';
import { CreateTeacherComponent } from './teachers/create-teacher/create-teacher.component';
import { EditTeacherComponent } from './teachers/edit-teacher/edit-teacher.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CourseComponent } from './course/course.component';
import { CreatecourseComponent } from './course/createcourse/createcourse.component';
import { EditcourseComponent } from './course/editcourse/editcourse.component';
import { SyllabusComponent } from './syllabus/syllabus.component';
import { CreateSyllabusComponent } from './syllabus/create-syllabus/create-syllabus.component';
import { EditSyllabusComponent } from './syllabus/edit-syllabus/edit-syllabus.component';
import { TestseriesComponent } from './testseries/testseries.component';
import { CreateTestseriesComponent } from './testseries/create-testseries/create-testseries.component';
import { EditTestseriesComponent } from './testseries/edit-testseries/edit-testseries.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { DataTablesModule } from 'angular-datatables';
import { EditMocktestComponent } from './mock-tests/edit-mocktest/edit-mocktest.component';
import { CreateMocktestComponent } from './mock-tests/create-mocktest/create-mocktest.component';
import { EditTopicComponent } from './topics/edit-topic/edit-topic.component';
import { EditCategoryComponent } from './category/edit-category/edit-category.component';
import { CreateJobNotificationComponent } from './job-notification/create-job-notification/create-job-notification.component';
import { EditJobNotificationComponent } from './job-notification/edit-job-notification/edit-job-notification.component';


import { CreateQuestionComponent } from './question/create-question/create-question.component';
import { EditQuestionComponent } from './question/edit-question/edit-question.component';
import { CreateSubjectComponent } from './subjects/create-subject/create-subject.component';
import { EditSubjectComponent } from './subjects/edit-subject/edit-subject.component';
import { CreateTopicComponent } from './topics/create-topic/create-topic.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { CreateContentmanagementComponent } from './content-management/create-contentmanagement/create-contentmanagement.component';
import { EditContentmanagementComponent } from './content-management/edit-contentmanagement/edit-contentmanagement.component';
import { CreateCategoryComponent } from './category/create-category/create-category.component';
import { EditBlogsComponent } from './blogs/edit-blogs/edit-blogs.component';
import { CreateBlogsComponent } from './blogs/create-blogs/create-blogs.component';
import { TopicsComponent } from './topics/topics.component';
import { MockTestsComponent } from './mock-tests/mock-tests.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { CategoryComponent } from './category/category.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuestionComponent } from './question/question.component';
import { BlogsComponent } from './blogs/blogs.component';
import { JobNotificationComponent } from './job-notification/job-notification.component';
import { AddSyllabusComponent } from './syllabus/add-syllabus/add-syllabus.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeTableModule } from 'primeng/treetable';
import { AddVideosComponent } from './content-management/create-contentmanagement/add-videos/add-videos.component';
import { AddNotesComponent } from './content-management/create-contentmanagement/add-notes/add-notes.component';
import { TreeSelectModule } from 'primeng/treeselect';
import { EditVideoComponent } from './content-management/edit-contentmanagement/edit-video/edit-video.component';
import { EditNotesComponent } from './content-management/edit-contentmanagement/edit-notes/edit-notes.component';
import { AddQuestionComponent } from './mock-tests/add-question/add-question.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { EditAdminProfileComponent } from './admin-profile/edit-admin-profile/edit-admin-profile.component';
import { UpdatePasswordComponent } from './admin-profile/update-password/update-password.component';
import { MathModule } from "../math/math.module";
import { NgxTextEditorModule } from 'ngx-text-editor';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PromotionComponent } from './promotion/promotion.component';
import { CreatePromotionComponent } from './promotion/create-promotion/create-promotion.component';
import { EditPromotionComponent } from './promotion/edit-promotion/edit-promotion.component';
@NgModule({
  declarations: [
    AdminComponent,
    CreateComponent,
    EditComponent,
    TopicsComponent,
    EditTopicComponent,
    CreateTopicComponent,
    StudentsComponent,
    CreateStudentComponent,
    EditStudentComponent,
    TeachersComponent,
    CreateTeacherComponent,
    EditTeacherComponent,
    CourseComponent,
    CreatecourseComponent,
    EditcourseComponent,
    SyllabusComponent,
    CreateSyllabusComponent,
    EditSyllabusComponent,
    CreateTestseriesComponent,
    TestseriesComponent,
    EditTestseriesComponent,
    MockTestsComponent,
    EditMocktestComponent,
    CreateMocktestComponent,
    ContentManagementComponent,
    SubjectsComponent,
    CreateSubjectComponent,
    EditSubjectComponent,
    CategoryComponent,
    EditCategoryComponent,
    CreateCategoryComponent,
    BlogsComponent,
    EditBlogsComponent,
    CreateBlogsComponent,
    QuestionComponent,
    CreateQuestionComponent,
    EditQuestionComponent,
    CategoryComponent,
    SubjectsComponent,
    TopicsComponent,
    CreateJobNotificationComponent,
    EditJobNotificationComponent,
    CreateContentmanagementComponent,
    EditContentmanagementComponent,
    JobNotificationComponent,
    AddSyllabusComponent,
    AddVideosComponent,
    AddNotesComponent,
    EditVideoComponent,
    EditNotesComponent,
    AddQuestionComponent,
    AdminProfileComponent,
    EditAdminProfileComponent,
    UpdatePasswordComponent,
    PromotionComponent,
    CreatePromotionComponent,
    EditPromotionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ModalModule.forChild(),
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    ModalModule,
    TreeTableModule,
    TreeSelectModule,
    MathModule,
    AngularEditorModule

  ],
  entryComponents: [
    CreateCategoryComponent,
    EditCategoryComponent,
    AddQuestionComponent
  ]

})
export class AdminModule { }
