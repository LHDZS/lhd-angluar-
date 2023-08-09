import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { PatrolrecordRoutingModule } from './patrolrecord.routing';
import { PatrolrecordService } from './patrolrecord.service';
import { PatrolrecordListComponent } from './patrolrecord-list/patrolrecord-list.component';
import { PatrolrecordDetailComponent } from './patrolrecord-detail/patrolrecord-detail.component';
import { DxDataGridModule, DxFormModule, DxPopupModule, DxButtonModule, DxRadioGroupModule, DxLoadPanelModule,
    DxTooltipModule,
    DxTemplateModule
} from 'devextreme-angular';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { PrintPageModule } from 'nxin-print';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
import { UploadViewModule } from 'src/app/components/upload-view/upload-view.module';
import { EditorGridModule } from 'src/app/components/editor-grid';
@NgModule({
    imports: [
        CommonModule,
        PatrolrecordRoutingModule,
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
        DxTooltipModule,
        DxTemplateModule,
        UploadViewModule,
        EditorGridModule
    ],
    providers: [PatrolrecordService],
    declarations: [PatrolrecordListComponent, PatrolrecordDetailComponent],
})
export class PatrolrecordModule {}
