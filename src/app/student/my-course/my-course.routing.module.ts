
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyCourseComponent } from './buy-course/buy-course.component';
import { CourseListComponent } from './course-list/course-list.component';
import { MyCourseComponent } from './my-course.component';
import { ViewCourseComponent } from './view-course/view-course.component';

const routes: Routes = [
    {
        path: '',
        component: MyCourseComponent,
        children: [
            {
                path: 'list/:tab', component: CourseListComponent

            },
            {
                path: 'buy/:id/:tab', component: BuyCourseComponent

            },
            {
                path: 'view/:id/:tab', component: ViewCourseComponent

            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyCourseRoutingModule { }