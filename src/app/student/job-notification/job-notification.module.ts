import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobNotificationRoutingModule } from './job-notification-routing.module';
import { JobNotificationComponent } from './job-notification.component';


@NgModule({
  declarations: [
    JobNotificationComponent
  ],
  imports: [
    CommonModule,
    JobNotificationRoutingModule
  ]
})
export class JobNotificationModule { }
