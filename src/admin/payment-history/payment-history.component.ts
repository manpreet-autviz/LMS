import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonService } from '@shared/helpers/common.service';
import { PaymentDto, PaymentServiceProxy } from '@shared/service-proxies/service-proxies';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent extends AppComponentBase implements OnInit,AfterViewInit, OnDestroy {
   @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  title = 'datatables';
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 10,
    lengthMenu: [[10, 50, 100, 200, 500, -1], [10, 50, 100, 200, 500, "All"]],
    order: [],
  };
  id:any;

  loading = false;
  allPayment:any=[];
  paymentresult: PaymentDto= new PaymentDto();
  dtTrigger: Subject<any> = new Subject<any>();
  type:string;
  constructor( injector:Injector,private _paymentService:PaymentServiceProxy,private common:CommonService  ) {
     super(injector)
   }

  ngOnInit(): void {
  
    this.getPaymentResult();
    //this.getcreatepayment();
  }
 ngAfterViewInit(): void {
    this.dtTrigger.next();

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  renderer(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
            this.dtTrigger.next();

      })
    }
  }
  
 getcreatepayment(){
    this._paymentService.createPayment(this.paymentresult).subscribe(res=>{
      this.allPayment=res;
   })
  }

  getPaymentResult(){
     this.loading = true;
      this._paymentService.getPaymentHistory(this.type).subscribe(res => {
      this.allPayment=res;
      var navContent = { title: "Payment History", lengthh: this.allPayment.length }
      this.common.pageTitle.next(navContent)
      this.loading = false;
        this.renderer();
     
    },(err)=>{
      this.loading=false;
    });
  }
  

}
