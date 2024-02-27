import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MockTestComponent } from '../mock-test/mock-test.component';
import {MyMockComponent} from './my-mock.component'


const routes: Routes = [
    {
        path: '',
        component: MyMockComponent,
        children: [
          
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyMockRoutingModule { }