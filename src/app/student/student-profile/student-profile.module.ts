import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { StudentProfileRoutingModule } from './student-profile-routing.module';
import { EditstudentprofileComponent } from './editstudentprofile/editstudentprofile.component';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from '@shared/shared.module';
import { UpdatePasswordComponent } from './update-password/update-password.component';

@NgModule({
  declarations: [
    EditstudentprofileComponent,
    UpdatePasswordComponent,
  ],
  imports: [
    CommonModule,
    StudentProfileRoutingModule,
    BsDropdownModule,
 
    FormsModule,
    SharedModule
    
  ]
})
export class StudentProfileModule { }
