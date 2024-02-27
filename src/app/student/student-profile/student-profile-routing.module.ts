import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentProfileComponent } from './student-profile.component';

const routes: Routes = [
  {
      path: '',
      component: StudentProfileComponent,
      children: [
          
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentProfileRoutingModule { }
