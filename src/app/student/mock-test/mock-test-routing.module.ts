import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MockTestComponent } from './mock-test.component';
const routes: Routes = [{
  path: '',
  component: MockTestComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MockTestRoutingModule { }
