import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockTestRoutingModule } from './mock-test-routing.module';
import { MockTestComponent } from './mock-test.component';
import { CountdownModule } from 'ngx-countdown';
import { ViewResultComponent } from './view-result/view-result.component';
import { MathModule } from 'math/math.module';

@NgModule({
  declarations: [
    MockTestComponent,
    ViewResultComponent,
  ],
  imports: [
    CommonModule,
    MockTestRoutingModule,
    CountdownModule,
    MathModule
  ]
})
export class MockTestModule  { }
