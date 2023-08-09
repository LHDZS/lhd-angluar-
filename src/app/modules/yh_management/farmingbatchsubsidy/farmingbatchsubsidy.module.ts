import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarmingBatchSubsidyDetailComponent } from './farmingbatchsubsidy-detail/farmingbatchsubsidy-detail.component';
import { FarmingBatchSubsidyListComponent } from './farmingbatchsubsidy-list/farmingbatchsubsidy-list.component';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';
import { GridViewModule } from 'src/app/components/grid-view';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { RouterModule } from '@angular/router';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxButtonModule, DxDataGridModule, DxFormModule, DxLoadPanelModule, DxPopoverModule, DxRadioGroupModule, DxScrollViewModule, DxSelectBoxModule } from 'devextreme-angular';
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
        CommonModule,
        ViewContainerModule,
        GridViewModule,
        EditorGridModule,
        DxPopupModule,
        DxScrollViewModule,
        SafeHtmlModule,
        CommonModule,
        DxDataGridModule,
        DxFormModule,
        DxPopupModule,
        DxButtonModule,
        DxRadioGroupModule,
        NxToolbarPanelModule,
        NxSearchPanelModule,
        NxFormListModule,
        NxFormDetailModule,
        NxHeaderSearchPanelModule,
        UploadViewModule,
        DxLoadPanelModule,
        NxFormListHeaderPanelModule,
        DxPopoverModule,
        DxSelectBoxModule,
        TranslateModule,
        FormulaComputingModule,
        RouterModule.forChild([
            {
                path: '',
                component: FarmingBatchSubsidyListComponent,
            },
            {
                path: 'detail',
                component: FarmingBatchSubsidyDetailComponent,
            },
        ]),
    ],
    declarations: [
        FarmingBatchSubsidyListComponent,
        FarmingBatchSubsidyDetailComponent
    ],
})
export class FarmingBatchSubsidyModule {}
