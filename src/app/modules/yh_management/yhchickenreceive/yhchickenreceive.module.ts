import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { YhChickenReceiveRoutingModule } from './yhchickenreceive.routing';
import { YhChickenReceiveService } from './yhchickenreceive.service';
import { YhChickenReceiveListComponent } from './yhchickenreceive-list/yhchickenreceive-list.component';
import { YhChickenReceiveDetailComponent } from './yhchickenreceive-detail/yhchickenreceive-detail.component';
import { DxDataGridModule, DxFormModule, DxPopupModule, DxButtonModule, DxRadioGroupModule,DxLoadPanelModule } from 'devextreme-angular';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { PrintPageModule } from 'nxin-print';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
@NgModule({
    imports: [
        CommonModule,
        YhChickenReceiveRoutingModule,
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
    ],
    providers: [YhChickenReceiveService],
    declarations: [YhChickenReceiveListComponent, YhChickenReceiveDetailComponent],
})
export class YhChickenReceiveModule {}
