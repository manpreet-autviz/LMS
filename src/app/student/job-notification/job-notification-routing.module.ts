import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobNotificationComponent } from './job-notification.component';

const routes: Routes = [{
  path: '',
  component: JobNotificationComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobNotificationRoutingModule { }
