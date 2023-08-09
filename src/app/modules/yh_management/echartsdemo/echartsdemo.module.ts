import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EchartsDemoComponent } from './echartsdemo.component';
import { EchartsDemoRoutingModule } from './echartsdemo.routing';
import { NxFormSingleModule } from 'src/app/components/nx-form-single/nx-form-single.component';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';
import { GridViewModule } from 'src/app/components/grid-view';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { RouterModule } from '@angular/router';
import { DxButtonModule, DxDataGridModule, DxFormModule, DxLoadPanelModule, DxPopoverModule, DxPopupModule, DxRadioGroupModule, DxScrollViewModule, DxSelectBoxModule } from 'devextreme-angular';
import { SafeHtmlModule } from 'src/app/providers/pipes/safe-html.pipe';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { UploadViewModule } from 'src/app/components/upload-view/upload-view.module';
import { NxFormListHeaderPanelModule } from 'src/app/components/nx-form-list-header-panel/nx-form-list-header-panel.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormulaComputingModule } from 'src/app/components/formula-computing/formula-computing.module';


@NgModule({
    imports: [
        // NxSearchPanelModule,
        // SafeHtmlModule,
        // RouterModule,
        EditorGridModule,
        CommonModule,
        EchartsDemoRoutingModule,
        NxFormSingleModule,
        NxFormDetailModule,
        NxFormListHeaderPanelModule,
        DxDataGridModule,
        DxPopoverModule,
        DxSelectBoxModule,
        DxButtonModule,
        NxFormListModule,
        NxToolbarPanelModule,
        DxPopupModule,
        DxFormModule,
        NxHeaderSearchPanelModule,
        TranslateModule,
        FormulaComputingModule,
    ],
    declarations: [EchartsDemoComponent],
})
export class EchartsDemoModule {}
