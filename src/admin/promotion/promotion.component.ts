import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonServiceServiceProxy, PromotionDto, PromotionServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreatePromotionComponent } from './create-promotion/create-promotion.component';
import { AppComponentBase } from '@shared/app-component-base';
import { EditPromotionComponent } from './edit-promotion/edit-promotion.component';
import { result } from 'lodash-es';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CommonService } from '@shared/helpers/common.service';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent extends AppComponentBase implements OnInit,
 AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  title = "datatables";
  dtOptions: DataTables.Settings = {
    pagingType: "simple_numbers",
    pageLength: 10,
    lengthMenu: [
      [10, 50, 100, 200, 500, -1],
      [10, 50, 100, 200, 500, "All"],
    ],
    order: [],
  };
  promotion: PromotionDto = new PromotionDto;
  allpromotion: any = [];
  loading = false;
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(injector: Injector, private _promotionservice: PromotionServiceProxy,private _modalService: BsModalService,
     public commonService: CommonServiceServiceProxy, private common: CommonService) {
    super(injector);
  }
  ngOnInit(): void {
    this.getallpromotion();
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

      });
    }
  }

  showCreateOrEditDialog(id?: number): void {
    let createOrEditTenantDialog: BsModalRef;
    if (!id) {
      createOrEditTenantDialog = this._modalService.show(
        CreatePromotionComponent,
        {
          class: "modal-lg modal-dialog-centered",
        }
      );
    } else {
      createOrEditTenantDialog = this._modalService.show(
        EditPromotionComponent,
        {
          class: "modal-lg modal-dialog-centered",
          initialState: {
            id: id,
          },
        }
      );
    }
    createOrEditTenantDialog.content.onSave.subscribe(() => {
      this.getallpromotion();
    });
  }

  getallpromotion() {
    this.loading = true;
    this._promotionservice.getAll("", 0, 1000).subscribe((res) => {
      this.allpromotion = res.items;
      var navContent = { title: "Promotion", lengthh: this.allpromotion.length }
      this.common.pageTitle.next(navContent)
      this.loading = false;
      this.renderer();
    },(err)=>{
      this.loading=false;
    });
  }

  delPromotion(allpromotion: any) {
    abp.message.confirm(
      this.l("This promotions will be deleted...!!"),
      undefined,
      (result: boolean) => {
        if (result) {
          this._promotionservice.delete(allpromotion.id).subscribe((res) => {
            this.notify.success("Deleted SuccessFully");
            this.getallpromotion();
          });
        }
      }
    )

  }
}
