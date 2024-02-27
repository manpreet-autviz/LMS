import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyMockComponent } from './my-mock.component';
import {MyMockRoutingModule} from './my-mock.routing.module';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { MyMockViewComponent } from './my-mock-view/my-mock-view.component'
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [
    MyMockComponent,
    UpcomingComponent,
    MyMockViewComponent,
  ],
  imports: [
    CommonModule,
    MyMockRoutingModule,
    TabsModule
  ]
})
export class MyMockModule { }
