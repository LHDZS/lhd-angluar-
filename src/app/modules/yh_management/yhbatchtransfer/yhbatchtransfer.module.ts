import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { YhBatchTransferRoutingModule } from './yhbatchtransfer.routing';
import { YhBatchTransferService } from './yhbatchtransfer.service';
import { YhBatchTransferListComponent } from './yhbatchtransfer-list/yhbatchtransfer-list.component';
import { YhBatchTransferDetailComponent } from './yhbatchtransfer-detail/yhbatchtransfer-detail.component';
import { DxDataGridModule, DxFormModule, DxPopupModule, DxButtonModule, DxRadioGroupModule,DxLoadPanelModule } from 'devextreme-angular';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { PrintPageModule } from 'nxin-print';
@NgModule({
    imports: [
        CommonModule,
        YhBatchTransferRoutingModule,
        NxToolbarPanelModule,
        NxSearchPanelModule,
        NxFormListModule,
        NxFormDetailModule,
        DxPopupModule,
        DxDataGridModule,
        DxFormModule,
        DxPopupModule,
        DxButtonModule,
        DxRadioGroupModule,
        NxHeaderSearchPanelModule,
        PrintPageModule,
        DxLoadPanelModule
    ],
    providers: [YhBatchTransferService],
    declarations: [YhBatchTransferListComponent, YhBatchTransferDetailComponent],
})
export class YhBatchTransferModule {}
