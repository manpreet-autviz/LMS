import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MockResultComponent } from './mock-result.component';

const routes: Routes = [{
  path: '',
  component: MockResultComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MockResultRoutingModule { }
