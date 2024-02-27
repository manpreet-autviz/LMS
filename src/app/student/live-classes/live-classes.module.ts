import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveClassesRoutingModule } from './live-classes-routing.module';
import { LiveClassesComponent } from './live-classes.component';


@NgModule({
  declarations: [
    LiveClassesComponent
  ],
  imports: [
    CommonModule,
    LiveClassesRoutingModule
  ]
})
export class LiveClassesModule { }
