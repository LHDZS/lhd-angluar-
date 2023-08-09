import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YHOutHouseRecycleRoutes as YHOutHouseRecycleRoutes } from './yhouthouserecycle.routing';
import { YHOutHouseRecycleListComponent} from './yhouthouserecycle-list/yhouthouserecycle-list.component';
import { YHOutHouseRecycleComponent as YHOutHouseRecycleComponent } from './yhouthouserecycle-create/yhouthouserecycle-create.component';
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
} from 'devextreme-angular';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { YHOutHouseRecycleService as YHOutHouseRecycleService } from './yhouthouserecycle.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslateModule } from 'src/app/providers/i18n-translate';
// import { YlwEarTagODataSource } from 'src/app/providers/odataContext/ylw.earTagODataSource';
import { PigFileCommandService } from 'src/app/providers/command-context/pig-file';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { FormsModule } from '@angular/forms';
import { PrintPageModule } from 'nxin-print';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';

@NgModule({
    imports: [
        CommonModule,
        YHOutHouseRecycleRoutes,
        NxFormDetailModule,
        NxToolbarPanelModule,
        ViewContainerModule,
        EditorGridModule,
        NxFormListModule,
        DxFormModule,
        DxPopupModule,
        DxButtonModule,
        DxTextBoxModule,
        DxSelectBoxModule,
        DxDateBoxModule,
        DxTextAreaModule,
        PrintPageModule,
        NxExcelImportModule,
        NxHeaderSearchPanelModule,
        NzToolTipModule,
        DxDataGridModule,
        TranslateModule,
        FormsModule,
    ],
    declarations: [YHOutHouseRecycleListComponent, YHOutHouseRecycleComponent],
    providers: [YHOutHouseRecycleService],
})
export class YHOutHouseRecycleModule { }
