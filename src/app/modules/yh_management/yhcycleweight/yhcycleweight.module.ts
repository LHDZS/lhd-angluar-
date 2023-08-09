import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YhCycleWeightComponent } from './yhcycleweight.component';
import { YhCycleWeightRoutingModule } from './yhcycleweight.routing';
import { NxFormSingleModule } from 'src/app/components/nx-form-single/nx-form-single.component';
// 日期多选
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
// 
import { NxFormListHeaderPanelModule } from 'src/app/components/nx-form-list-header-panel/nx-form-list-header-panel.component';
import {
    DxDataGridModule,
    DxPopoverModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxPopupModule,
    DxFormModule,
    DxTextAreaModule,
    DxLoadPanelModule,
    DxTabPanelModule,
    DxBoxModule,
    DxScrollViewModule
} from 'devextreme-angular';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { TranslateModule } from 'src/app/providers/i18n-translate';
import { GridViewModule } from 'src/app/components/grid-view';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';
import { SafeHtmlModule } from 'src/app/providers/pipes/safe-html.pipe';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { PrintPageModule } from 'nxin-print';



@NgModule({
    imports: [
        NxFormDetailModule,
        FormsModule,
        CommonModule,
        DxBoxModule,
        YhCycleWeightRoutingModule,
        NxFormSingleModule,
        NxFormListHeaderPanelModule,
        DxTabPanelModule,
        DxDataGridModule,
        DxPopoverModule,
        DxSelectBoxModule,
        DxButtonModule,
        NxFormListModule,
        NxToolbarPanelModule,
        DxTextAreaModule,
        DxPopupModule,
        DxFormModule,
        NxHeaderSearchPanelModule,
        TranslateModule,
        GridViewModule,
        EditorGridModule,
        ViewContainerModule,
        DxLoadPanelModule,
        NzDatePickerModule,
        DxScrollViewModule,
        SafeHtmlModule,
        PrintPageModule
    ],
    declarations: [YhCycleWeightComponent],
})
export class ZqYhCycleWeightModule {}
