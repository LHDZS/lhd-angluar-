import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { DrugOtherReceiveRoutingModule } from './drugotherreceive.routing';
import { DrugOtherReceiveService } from './drugotherreceive.service';
import { DrugOtherReceiveListComponent } from './drugotherreceive-list/drugotherreceive-list.component';
import { DrugOtherReceiveDetailComponent } from './drugotherreceive-detail/drugotherreceive-detail.component';
import { DxDataGridModule, DxFormModule, DxPopupModule, DxButtonModule, DxRadioGroupModule, DxTextBoxModule } from 'devextreme-angular';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { PrintPageModule } from 'nxin-print';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
@NgModule({
    imports: [
        CommonModule,
        DrugOtherReceiveRoutingModule,
        NxToolbarPanelModule,
        NxSearchPanelModule,
        NxFormListModule,
        NxFormDetailModule,
        DxPopupModule,
        DxDataGridModule,
        DxFormModule,
        DxPopupModule,
        DxButtonModule,
        DxTextBoxModule,
        DxRadioGroupModule,
        NxHeaderSearchPanelModule,
        PrintPageModule,
        NxExcelImportModule,
    ],
    providers: [DrugOtherReceiveService],
    declarations: [DrugOtherReceiveListComponent, DrugOtherReceiveDetailComponent],
})
export class DrugOtherReceiveModule {}
