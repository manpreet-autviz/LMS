import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyQuizTestRoutingModule } from './daily-quiz-test-routing.module';
import { DailyQuizTestComponent } from './daily-quiz-test/daily-quiz-test.component';
import { CountdownModule } from 'ngx-countdown';
import { ViewBlogResultComponent } from './view-blog-result/view-blog-result.component';
import { MathModule } from 'math/math.module';


@NgModule({
  declarations: [
    DailyQuizTestComponent,
    ViewBlogResultComponent
  ],
  imports: [
    CommonModule,
    DailyQuizTestRoutingModule,
    CountdownModule,
    MathModule
  ]
})
export class DailyQuizTestModule { }
