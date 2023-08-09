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
    DxListModule,
    DxScrollViewModule
} from 'devextreme-angular';
import { SafeHtmlModule } from 'src/app/providers/pipes/safe-html.pipe';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslateModule } from 'src/app/providers/i18n-translate';
import { yhmaterialsettingsService } from './yhmaterialsettings.service';
import { yhmaterialsettingsRoutes } from './yhmaterialsettings.routing';
import { yhmaterialsettingsListComponent } from './yhmaterialsettings-list/yhmaterialsettings-list.component';
import { yhmaterialsettingsDetailComponent } from './yhmaterialsettings-detail/yhmaterialsettings-detail.component';
import { ShowMapModule } from 'src/app/components/show-map/show-map.component';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { UploadViewModule } from 'src/app/components/upload-view/upload-view.module';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { PrintPageModule } from 'nxin-print';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';

@NgModule({
    imports: [
        CommonModule,
        ViewContainerModule,
        yhmaterialsettingsRoutes,
        NxToolbarPanelModule,
        NxFormListModule,
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
        DxListModule,
        ShowMapModule,
        EditorGridModule,
        UploadViewModule,
        NxFormDetailModule,
        PrintPageModule,
        DxScrollViewModule,
        SafeHtmlModule
    ],
    declarations: [yhmaterialsettingsListComponent, yhmaterialsettingsDetailComponent],
    providers: [yhmaterialsettingsService],
})
export class yhmaterialsettingsModule { }
