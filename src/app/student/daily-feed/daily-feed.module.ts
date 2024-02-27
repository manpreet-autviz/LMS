import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyFeedRoutingModule } from './daily-feed-routing.module';
import { DailyFeedComponent } from './daily-feed.component';
import { DailyQuizComponent } from './daily-quiz/daily-quiz.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CurrentAffairsComponent } from './current-affairs/current-affairs.component';
import { VocabularyComponent } from './vocabulary/vocabulary.component';
import { VideoComponent } from './video/video.component';
import { FormsModule } from '@angular/forms';
import { PlyrModule } from 'ngx-plyr';
import { ViewMoreComponent } from './view-more/view-more.component';
import { MathjaxDefaultConfig } from 'mathjax-angular/models';
import { MathModule } from 'math/math.module';



@NgModule({
  declarations: [
    DailyFeedComponent,
    DailyQuizComponent,
    CurrentAffairsComponent,
    VocabularyComponent,
    VideoComponent,
    ViewMoreComponent

  ],
  imports: [
    CommonModule,
    DailyFeedRoutingModule,
    TabsModule,
    FormsModule,
    PlyrModule,
    MathModule
  ]
})
export class DailyFeedModule { }
