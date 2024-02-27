import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyQuizTestComponent } from './daily-quiz-test/daily-quiz-test.component';
import { ViewBlogResultComponent } from './view-blog-result/view-blog-result.component';

const routes: Routes = [
  {
    path: '', component: DailyQuizTestComponent,
    children: [
      {
        path: 'View-Blog-Result/:id', component: ViewBlogResultComponent
      }
    ]
  },

  // {
  //   path: 'daily-quiz-explnation/:id/:result',
  //   loadChildren: () => import('app/student/daily-quiz-test/daily-quiz-test.module').then(m => m.DailyQuizTestModule), // Lazy load account module
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyQuizTestRoutingModule { }
