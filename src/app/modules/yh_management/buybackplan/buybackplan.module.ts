import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyBackPlanDetailComponent } from './buybackplan-detail/buybackplan-detail.component';
import { BuyBackPlanListComponent } from './buybackplan-list/buybackplan-list.component';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';
import { GridViewModule } from 'src/app/components/grid-view';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { RouterModule } from '@angular/router';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxButtonModule, DxDataGridModule, DxFormModule, DxLoadPanelModule, DxNumberBoxModule, DxRadioGroupModule, DxScrollViewModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { SafeHtmlModule } from 'src/app/providers/pipes/safe-html.pipe';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { UploadViewModule } from 'src/app/components/upload-view/upload-view.module';
import { PrintPageModule } from 'nxin-print';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
@NgModule({
    imports: [
        CommonModule,
        ViewContainerModule,
        GridViewModule,
        EditorGridModule,
        DxPopupModule,
        DxScrollViewModule,
        SafeHtmlModule,
        CommonModule,
        DxDataGridModule,
        DxFormModule,
        DxPopupModule,
        DxButtonModule,
        DxRadioGroupModule,
        NxToolbarPanelModule,
        NxSearchPanelModule,
        NxFormListModule,
        NxFormDetailModule,
        NxHeaderSearchPanelModule,
        UploadViewModule,
        DxTextBoxModule,
        DxSelectBoxModule,
        DxNumberBoxModule,
        DxLoadPanelModule,
        PrintPageModule,
        NxExcelImportModule,
        RouterModule.forChild([
            {
                path: '',
                component: BuyBackPlanListComponent,
            },
            {
                path: 'detail',
                component: BuyBackPlanDetailComponent,
            },
        ]),
    ],
    declarations: [
        BuyBackPlanListComponent,
        BuyBackPlanDetailComponent
    ],
})
export class BuyBackPlanModule {}
