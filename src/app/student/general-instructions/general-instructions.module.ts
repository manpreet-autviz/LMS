import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralInstructionsRoutingModule } from './general-instructions-routing.module';
import { GeneralInstructionsComponent } from './general-instructions.component';
import { PdfViewModule } from '../pdf-viewer/pdf-viewer.module';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [
    GeneralInstructionsComponent,
     
  ],
  imports: [
    CommonModule,
    GeneralInstructionsRoutingModule,
  ]
})
export class GeneralInstructionsModule { }
