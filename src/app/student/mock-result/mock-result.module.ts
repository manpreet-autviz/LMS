import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MockResultRoutingModule } from './mock-result-routing.module';
import { MockResultComponent } from './mock-result.component';


@NgModule({
  declarations: [
    MockResultComponent
  ],
  imports: [
    CommonModule,
    MockResultRoutingModule
  ]
})
export class MockResultModule { }
