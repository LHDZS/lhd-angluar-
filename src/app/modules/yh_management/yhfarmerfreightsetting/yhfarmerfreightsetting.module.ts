import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YHFreightSettingRoutes} from './yhfarmerfreightsetting.routing';
import { YHFarmerFreightSettingListComponent} from './yhfarmerfreightsetting-list/yhfarmerfreightsetting-list.component';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import {
    DxFormModule,
    DxButtonModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxTextAreaModule,
    DxDataGridModule,
    DxPopupModule,
    DxCheckBoxModule,
    DxHtmlEditorModule,
    DxScrollViewModule,
} from 'devextreme-angular';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { YHFreightSettingService as YHFreightSettingService } from './yhfarmerfreightsetting.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslateModule } from 'src/app/providers/i18n-translate';
// import { YlwEarTagODataSource } from 'src/app/providers/odataContext/ylw.earTagODataSource';
import { PigFileCommandService } from 'src/app/providers/command-context/pig-file';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { FormsModule } from '@angular/forms';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { SafeHtmlModule } from 'src/app/providers/pipes/safe-html.pipe';
import { UploadViewModule } from 'src/app/components/upload-view/upload-view.module';

@NgModule({
    imports: [
        CommonModule,
        YHFreightSettingRoutes,
        NxFormDetailModule,
        NxToolbarPanelModule,
        ViewContainerModule,
        EditorGridModule,
        NxFormListModule,
        NxSearchPanelModule,
        DxFormModule,
        DxPopupModule,
        DxButtonModule,
        DxTextBoxModule,
        DxSelectBoxModule,
        DxDateBoxModule,
        DxTextAreaModule,
        NxExcelImportModule,
        NxHeaderSearchPanelModule,
        NzToolTipModule,
        DxDataGridModule,
        TranslateModule,
        FormsModule,
        DxHtmlEditorModule,
        DxCheckBoxModule,
        SafeHtmlModule,
        DxScrollViewModule,
        UploadViewModule,
    ],
    declarations: [YHFarmerFreightSettingListComponent],
    providers: [YHFreightSettingService],
})
export class YHFreightSettingModule { }
