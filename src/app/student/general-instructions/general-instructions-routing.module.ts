import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralInstructionsComponent } from './general-instructions.component';

const routes: Routes = [
  {path:'',component:GeneralInstructionsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralInstructionsRoutingModule { }
