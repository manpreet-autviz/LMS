import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { UsersComponent } from "./users/users.component";
import { TenantsComponent } from "./tenants/tenants.component";
import { RolesComponent } from "app/roles/roles.component";
import { ChangePasswordComponent } from "./users/change-password/change-password.component";

import { AdminComponent } from "admin/admin/admin.component";
import { StudentsComponent } from "admin/students/students.component";
import { TeachersComponent } from "admin/teachers/teachers.component";
import { CourseComponent } from "admin/course/course.component";
import { SyllabusComponent } from "admin/syllabus/syllabus.component";
import { TestseriesComponent } from "admin/testseries/testseries.component";
import { BlogsComponent } from "admin/blogs/blogs.component";
import { CategoryComponent } from "admin/category/category.component";
import { JobNotificationComponent } from "admin/job-notification/job-notification.component";
import { QuestionComponent } from "admin/question/question.component";
import { SubjectsComponent } from "admin/subjects/subjects.component";
import { TopicsComponent } from "admin/topics/topics.component";
import { MockTestsComponent } from "admin/mock-tests/mock-tests.component";
import { ContentManagementComponent } from "admin/content-management/content-management.component";
import { CreateSubjectComponent } from "admin/subjects/create-subject/create-subject.component";
import { EditSubjectComponent } from "admin/subjects/edit-subject/edit-subject.component";
import { CreateSyllabusComponent } from "admin/syllabus/create-syllabus/create-syllabus.component";
import { EditSyllabusComponent } from "admin/syllabus/edit-syllabus/edit-syllabus.component";
import { CreateQuestionComponent } from "admin/question/create-question/create-question.component";
import { EditQuestionComponent } from "admin/question/edit-question/edit-question.component";
import { CreateBlogsComponent } from "admin/blogs/create-blogs/create-blogs.component";
import { EditBlogsComponent } from "admin/blogs/edit-blogs/edit-blogs.component";
import { CreateJobNotificationComponent } from "admin/job-notification/create-job-notification/create-job-notification.component";
import { EditJobNotificationComponent } from "admin/job-notification/edit-job-notification/edit-job-notification.component";
import { CreateMocktestComponent } from "admin/mock-tests/create-mocktest/create-mocktest.component";
import { EditMocktestComponent } from "admin/mock-tests/edit-mocktest/edit-mocktest.component";
import { CreateContentmanagementComponent } from "admin/content-management/create-contentmanagement/create-contentmanagement.component";
import { EditContentmanagementComponent } from "admin/content-management/edit-contentmanagement/edit-contentmanagement.component";
import { CreateTestseriesComponent } from "admin/testseries/create-testseries/create-testseries.component";
import { EditTestseriesComponent } from "admin/testseries/edit-testseries/edit-testseries.component";
import { PdfViewerComponent } from "ng2-pdf-viewer";
import { AdminProfileComponent } from "admin/admin-profile/admin-profile.component";
import { AdmindashboardComponent } from "./admindashboard/admindashboard.component";
import { StudentdashboardComponent } from "./studentdashboard/studentdashboard.component";
import { PromotionComponent } from "admin/promotion/promotion.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: AppComponent,
        children: [
          {
            path: "home",
            component: HomeComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "admindashboard",
            component: AdmindashboardComponent,
            canActivate: [AppRouteGuard],
            data: { permission: "Pages.AdminDashboard" }, 
          },
          {
            path: "studentdashboard",
            component: StudentdashboardComponent,
            canActivate: [AppRouteGuard],
           
          },
          {
            path: "users",
            component: UsersComponent,
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "roles",
            component: RolesComponent,
            data: { permission: "Pages.Roles" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "tenants",
            component: TenantsComponent,
            data: { permission: "Pages.Tenants" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "about",
            component: AboutComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "update-password",
            component: ChangePasswordComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "admin",
            component: AdminComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "students",
            component: StudentsComponent,
            canActivate: [AppRouteGuard],
            data: { permission: "Pages.StudentManagement" },
          },
          {
            path: "teachers",
            component: TeachersComponent,
            canActivate: [AppRouteGuard],
            data: { permission: "Pages.TeacherManagement" },
          },
          {
            path: "course",
            component: CourseComponent,
            canActivate: [AppRouteGuard],
            data: { permission: "Pages.Course" },
          },
          // {
          //   path: "syllabus",
          //   component: SyllabusComponent,
          //   canActivate: [AppRouteGuard],
          // },
          // {
          //   path: "create-syllabus",
          //   component: CreateSyllabusComponent,
          //   canActivate: [AppRouteGuard],
          // },
          // {
          //   path: "edit-syllabus/:id",
          //   component: EditSyllabusComponent,
          //   canActivate: [AppRouteGuard],
          // },
          // {
          //   path: "testseries",
          //   component: TestseriesComponent,
          //   canActivate: [AppRouteGuard],
          // },
          // {
          //   path: "create-testseries",
          //   component: CreateTestseriesComponent,
          //   canActivate: [AppRouteGuard],
          // },
          // {
          //   path: "edit-testseries/:id",
          //   component: EditTestseriesComponent,
          //   canActivate: [AppRouteGuard],
          // },
          {
            path: "category",
            component: CategoryComponent,
            canActivate: [AppRouteGuard],
            data: { permission: "Pages.Category" },
          },
          {
            path: "jobnotification",
            component: JobNotificationComponent,
            canActivate: [AppRouteGuard],
            data: { permission: "Pages.JobNotification" },
          },
          {
            path: "create-jobnotification",
            component: CreateJobNotificationComponent,
            canActivate: [AppRouteGuard],
           
          },
          {
            path: "edit-jobnotification/:id",
            component: EditJobNotificationComponent,
            canActivate: [AppRouteGuard],
           
            
          },
          // {
          //   path: "question",
          //   component: QuestionComponent,
          //   canActivate: [AppRouteGuard],
          // },
          // {
          //   path: "create-question",
          //   component: CreateQuestionComponent,
          //   canActivate: [AppRouteGuard],
          // },
          // {
          //   path: "edit-question/:id",
          //   component: EditQuestionComponent,
          //   canActivate: [AppRouteGuard],
          // },
          {
            path: "subjects",
            component: SubjectsComponent,
            canActivate: [AppRouteGuard],
            data: { permission: "Pages.Syllabus.ManageSubject" },
          },

          
          {
            path: "create-subject",
            component: CreateSubjectComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "edit-subject/:id",
            component: EditSubjectComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "topics",
            component: TopicsComponent,
            canActivate: [AppRouteGuard],
            data: { permission: "Pages.Syllabus.ManageTopics" },
          },
          {
            path: "mocktests",
            component: MockTestsComponent,
            canActivate: [AppRouteGuard],
            data: { permission: "Pages.QuestionsManage.MockTest" },
          },
          {
            path: "create-mocktests",
            component: CreateMocktestComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "edit-mocktests/:id",
            component: EditMocktestComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "contentmanagements",
            component: ContentManagementComponent,
            canActivate: [AppRouteGuard],
            data: { permission: "Pages.ContentManagament" },
          },
          {
            path: "create-contentmanagements",
            component: CreateContentmanagementComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "edit-contentmanagements/:id",
            component: EditContentmanagementComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "blogs",
            component: BlogsComponent,
            canActivate: [AppRouteGuard],
            data: { permission: "Pages.BlogManagement" },
          },
          {
            path: "create-blogs",
            component: CreateBlogsComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "edit-blogs/:id",
            component: EditBlogsComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "admin-profile",
            component: AdminProfileComponent,
          },

          {
            path: "promotion",
            component: PromotionComponent,
            canActivate: [AppRouteGuard],
            
            // data: { permission: "Pages.Promotion" },  
          },
         

          {
            path: "student",
            loadChildren: () =>
              import("app/student/student.module").then((m) => m.StudentModule), // Lazy load account module
            canActivate: [AppRouteGuard],
          },
          {
            path: "payment-history",
            loadChildren: () =>
              import("admin/payment-history/payment-history.module").then((m) => m.PaymentHistoryModule), // Lazy load account module
          },
        
        ],
      },
    ]),
  ],
  exports: [RouterModule]

})
export class AppRoutingModule { }
