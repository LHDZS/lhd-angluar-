import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutStockAgeSettingComponent } from './outstockagesetting.component';
import { OutStockAgeSettingRoutingModule } from './outstockagesetting.routing';
import { NxFormSingleModule } from 'src/app/components/nx-form-single/nx-form-single.component';
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
    DxLookupModule
} from 'devextreme-angular';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { TranslateModule } from 'src/app/providers/i18n-translate';
import { GridViewModule } from 'src/app/components/grid-view';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';

@NgModule({
    imports: [
        CommonModule,
        OutStockAgeSettingRoutingModule,
        NxFormSingleModule,
        NxFormListHeaderPanelModule,
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
        DxLookupModule
    ],
    declarations: [OutStockAgeSettingComponent],
})
export class OutStockAgeSettingModule {}
