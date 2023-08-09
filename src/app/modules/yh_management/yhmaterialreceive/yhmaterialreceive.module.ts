import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { YhMaterialReceiveRoutingModule } from './yhmaterialreceive.routing';
import { YhMaterialReceiveService } from './yhmaterialreceive.service';
import { YhMaterialReceiveListComponent } from './yhmaterialreceive-list/yhmaterialreceive-list.component';
import { YhMaterialReceiveDetailComponent } from './yhmaterialreceive-detail/yhmaterialreceive-detail.component';
import { DxDataGridModule, DxFormModule, DxPopupModule, DxButtonModule, DxRadioGroupModule,DxLoadPanelModule, DxTabPanelModule } from 'devextreme-angular';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { PrintPageModule } from 'nxin-print';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
import { YhMaterialReceiveListDetailModule } from './yhmaterialreceive-list/yhmaterialreceive-list-detail/yhmaterialreceive-list-detail.component';
@NgModule({
    imports: [
        CommonModule,
        YhMaterialReceiveRoutingModule,
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
        DxLoadPanelModule,
        NxExcelImportModule,
        DxTabPanelModule,
        YhMaterialReceiveListDetailModule
    ],
    providers: [YhMaterialReceiveService],
    declarations: [YhMaterialReceiveListComponent, YhMaterialReceiveDetailComponent],
})
export class YhMaterialReceiveModule {}
