import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StudentComponent } from "./student.component";

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('app/student/dashboard/dashboard.module').then(m => m.DashboardModule), // Lazy load account module
  },
  {
    path: 'my-course',
    loadChildren: () => import('app/student/my-course/my-course.module').then(m => m.MyCourseModule), // Lazy load account module

  },

  {
    path: 'mock/:tab',
    loadChildren: () => import('app/student/my-mock/my-mock.module').then(m => m.MyMockModule), // Lazy load account module

  },
  {
    path: 'daily-feed/:tab',
    loadChildren: () => import('app/student/daily-feed/daily-feed.module').then(m => m.DailyFeedModule), // Lazy load account module

  },
  {
    path: 'student-live/:id',
    loadChildren: () => import('app/student/live-class-student/live-class-student.module').then(m => m.LiveClassStudentModule), // Lazy load account module

  },
  {
    path: 'live-classes',
    loadChildren: () => import('app/student/live-classes/live-classes.module').then(m => m.LiveClassesModule), // Lazy load account module

  },
  {
    path: 'help',
    loadChildren: () => import('app/student/help/help.module').then(m => m.HelpModule), // Lazy load account module

  },

  {
    path: 'student-profile',
    loadChildren: () => import('app/student/student-profile/student-profile.module').then(m => m.StudentProfileModule), // Lazy load account module

  },
  {
    path: 'job-notification',
    loadChildren: () => import('app/student/job-notification/job-notification.module').then(m => m.JobNotificationModule), // Lazy load account module
  },
  {
    path: 'mock-result',
    loadChildren: () => import('app/student/mock-result/mock-result.module').then(m => m.MockResultModule), // Lazy load account module
  },
  {
    path: 'mock-result/:id',
    loadChildren: () => import('app/student/mock-result/mock-result.module').then(m => m.MockResultModule), // Lazy load account module
  },
  {
    path: 'mock-test/:id',
    loadChildren: () => import('app/student/mock-test/mock-test.module').then(m => m.MockTestModule), // Lazy load account module
  },

  {
    path: 'mock-test/:id/:isReattempt',
    loadChildren: () => import('app/student/mock-test/mock-test.module').then(m => m.MockTestModule), // Lazy load account module
  },
  {
    path: 'mock-test/:id/:isView',
    loadChildren: () => import('app/student/mock-test/mock-test.module').then(m => m.MockTestModule), // Lazy load account module
  },
  {
    path: 'mock-test-explnation/:id/:result',
    loadChildren: () => import('app/student/mock-test/mock-test.module').then(m => m.MockTestModule), // Lazy load account module
  },
  {
    path: 'app-my-mock-view',
    loadChildren: () => import('app/student/mock-test/mock-test.module').then(m => m.MockTestModule), // Lazy load account module
  },
  {
    path: 'pdf-viewer/:id',
    loadChildren: () => import('app/student/pdf-viewer/pdf-viewer.module').then(m => m.PdfViewModule), // Lazy load account module
  },
  {
    path: 'general-instructions/:id',
    loadChildren: () => import('app/student/general-instructions/general-instructions.module').then(m => m.GeneralInstructionsModule), // Lazy load account module
  },
  {
    path: 'daily-quiz-test/:id',
    loadChildren: () => import('app/student/daily-quiz-test/daily-quiz-test.module').then(m => m.DailyQuizTestModule), // Lazy load account module
  },
  {
    path: 'daily-quiz-explnation/:id/:result',
    loadChildren: () => import('app/student/daily-quiz-test/daily-quiz-test.module').then(m => m.DailyQuizTestModule), // Lazy load account module
  },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule { }
