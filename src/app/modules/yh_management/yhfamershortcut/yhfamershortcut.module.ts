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
    DxListModule
} from 'devextreme-angular';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslateModule } from 'src/app/providers/i18n-translate';
import { yhfamershortcutService } from './yhfamershortcut.service';
import { yhfamershortcutRoutes } from './yhfamershortcut.routing';
import { yhfamershortcutListComponent } from './yhfamershortcut-list/yhfamershortcut-list.component';
import { yhfamershortcutDetailComponent } from './yhfamershortcut-detail/yhfamershortcut-detail.component';
import { ShowMapModule } from 'src/app/components/show-map/show-map.component';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { UploadViewModule } from 'src/app/components/upload-view/upload-view.module';

@NgModule({
    imports: [
        CommonModule,
        yhfamershortcutRoutes,
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
        UploadViewModule
    ],
    declarations: [yhfamershortcutListComponent, yhfamershortcutDetailComponent],
    providers: [yhfamershortcutService],
})
export class yhfamershortcutModule { }
