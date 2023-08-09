import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { DxButtonModule, DxCalendarModule, DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxDropDownButtonModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxScrollViewModule, DxSelectBoxModule, DxTagBoxModule, DxTextAreaModule, DxTextBoxModule, DxValidationGroupModule, DxValidatorModule } from 'devextreme-angular';
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { FormsModule } from '@angular/forms';
import { NxMessageBoxModule } from 'src/app/components/message-box/message-box.component';
import { YhCashDepositService } from './yhcashdeposit.service';
import { YhCashDepositListComponent } from './yhcashdeposit-list/yhcashdeposit-list.component';
import { YhCashDepositDetailComponent } from './yhcashdeposit-detail/yhcashdeposit-detail.component';
import { YhCashDepositRoutingModule } from './yhcashdeposit.routing';
import { NxReviewComponent, NxReviewModule } from 'src/app/components/review/review.component';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { SafeHtmlModule } from 'src/app/providers/pipes/safe-html.pipe';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';
import { GridViewModule } from 'src/app/components/grid-view';
import { PrintPageModule } from 'nxin-print';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';

@NgModule({
    imports: [
        CommonModule,
        YhCashDepositRoutingModule,
        NxToolbarPanelModule,
        NxSearchPanelModule,
        NxFormListModule,
        NxFormDetailModule,
        PrintPageModule,
        NxExcelImportModule,
        NxHeaderSearchPanelModule,
        DxPopupModule,
        DxTextBoxModule,
        DxSelectBoxModule,
        DxCheckBoxModule,
        DxButtonModule,
        DxDataGridModule,
        NzDatePickerModule,
        FormsModule,
        DxFormModule,
        DxValidatorModule,
        DxValidationGroupModule,
        DxDateBoxModule,
        DxNumberBoxModule,
        NxMessageBoxModule,
        DxTagBoxModule,
        DxCalendarModule,
        DxScrollViewModule,
        NxReviewModule,
        ViewContainerModule,
        GridViewModule,
        EditorGridModule,
        SafeHtmlModule,
        DxDropDownButtonModule,
    ],
    providers: [YhCashDepositService],
    declarations: [YhCashDepositListComponent, YhCashDepositDetailComponent],
})
export class YhCashDepositModule {}
