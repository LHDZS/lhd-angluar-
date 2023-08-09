import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { YHPoultrySalesRoutingModule } from './yhpoultrysales.routing';
import { YHPoultrySalesService } from './yhpoultrysales.service';
import { YHPoultrSalesListComponent } from './yhpoultrysales-list/yhpoultrysales-list.component';
import { YHPoultrySalesDetailComponent } from './yhpoultrysales-detail/yhpoultrysales-detail.component';
import {
    DxDataGridModule,
    DxFormModule,
    DxPopupModule,
    DxButtonModule,
    DxRadioGroupModule,
    DxSelectBoxModule,
    DxLoadPanelModule,
    DxTabPanelModule,
} from 'devextreme-angular';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { GridViewModule } from 'src/app/components/grid-view';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';
import { UploadViewModule } from 'src/app/components/upload-view/upload-view.module';
import { PrintPageModule } from 'nxin-print';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
import { YHPoultrSalesListDetailModule } from './yhpoultrysales-list/yhpoultrysales-list-detail/yhpoultrysales-list-detail.component';
@NgModule({
    imports: [
        CommonModule,
        YHPoultrySalesRoutingModule,
        NxToolbarPanelModule,
        NxSearchPanelModule,
        DxTabPanelModule,
        NxFormListModule,
        NxFormDetailModule,
        DxPopupModule,
        DxDataGridModule,
        DxFormModule,
        DxPopupModule,
        DxButtonModule,
        DxRadioGroupModule,
        NxHeaderSearchPanelModule,
        DxSelectBoxModule,
        GridViewModule,
        EditorGridModule,
        ViewContainerModule,
        UploadViewModule,
        DxLoadPanelModule,
        PrintPageModule,
        NxExcelImportModule,
        YHPoultrSalesListDetailModule
    ],
    providers: [YHPoultrySalesService],
    declarations: [YHPoultrSalesListComponent, YHPoultrySalesDetailComponent],
})
export class YHPoultrySalesModule {}
