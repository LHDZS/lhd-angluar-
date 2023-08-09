import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
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
    DxScrollViewModule,
    DxListModule,
    DxLoadPanelModule
} from 'devextreme-angular';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslateModule } from 'src/app/providers/i18n-translate';
import { yhfarmerInformationService } from './yhfarmerInformation.service';
import { yhfarmerInformationRoutes } from './yhfarmerInformation.routing';
import { yhfarmerInformationListComponent } from './yhfarmerInformation-list/yhfarmerInformation-list.component';
import { yhfarmerInformationDetailComponent } from './yhfarmerInformation-detail/yhfarmerInformation-detail.component';
import { ShowMapModule } from 'src/app/components/show-map/show-map.component';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { UploadViewModule } from 'src/app/components/upload-view/upload-view.module';
import { SafeHtmlModule } from 'src/app/providers/pipes/safe-html.pipe';

@NgModule({
    imports: [
        CommonModule,
        yhfarmerInformationRoutes,
        NxToolbarPanelModule,
        NxFormListModule,
        DxScrollViewModule,
        SafeHtmlModule,
        DxListModule,
        DxLoadPanelModule,
        DxFormModule,
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
        DxPopupModule,
        ShowMapModule,
        EditorGridModule,
        UploadViewModule
    ],
    declarations: [yhfarmerInformationListComponent, yhfarmerInformationDetailComponent],
    providers: [yhfarmerInformationService],
})
export class yhfarmerInformationModule { }
