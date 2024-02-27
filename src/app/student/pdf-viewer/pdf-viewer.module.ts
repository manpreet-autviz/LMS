import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerRoutingModule } from './pdf-viewer-routing.module';
import { PdfViewerComponent } from './pdf-viewer.component';


@NgModule({
  declarations: [
    PdfViewerComponent
  ],
  imports: [
    CommonModule,
    PdfViewerModule,
    PdfViewerRoutingModule
  ]
})
export class PdfViewModule { }

