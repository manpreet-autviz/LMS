import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentAffairsComponent } from './current-affairs/current-affairs.component';
import { DailyFeedComponent } from './daily-feed.component';
import { DailyQuizComponent } from './daily-quiz/daily-quiz.component';
import { VideoComponent } from './video/video.component';

const routes: Routes = [{
  path: '',
  component: DailyFeedComponent,
  children: [
    {
      path: 'daily-quiz', component: DailyQuizComponent

    },
    {
      path: 'current-affairs', component: CurrentAffairsComponent

    },
    {
      path: 'video', component: VideoComponent

    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyFeedRoutingModule { }
