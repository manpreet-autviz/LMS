import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentHistoryRoutingModule } from './payment-history-routing.module';
import { PaymentHistoryComponent } from './payment-history.component';
import { SharedModule } from 'primeng/api';
import { DataTablesModule } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    PaymentHistoryComponent
  ],
  imports: [
    CommonModule,
    PaymentHistoryRoutingModule,
    DataTablesModule,
    NgxPaginationModule,
    SharedModule,
  ]
})
export class PaymentHistoryModule { }
