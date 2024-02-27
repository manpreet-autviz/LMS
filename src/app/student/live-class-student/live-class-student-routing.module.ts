import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LiveClassStudentComponent} from'../live-class-student/live-class-student.component'

const routes: Routes = [{
  path:"",
  component:LiveClassStudentComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveClassStudentRoutingModule { }
