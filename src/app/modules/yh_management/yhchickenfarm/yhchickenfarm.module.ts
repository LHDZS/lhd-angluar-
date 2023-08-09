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
    DxLoadPanelModule
} from 'devextreme-angular';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslateModule } from 'src/app/providers/i18n-translate';
import { yhchickenfarmService } from './yhchickenfarm.service';
import { yhchickenfarmRoutes } from './yhchickenfarm.routing';
import { yhchickenfarmListComponent } from './yhchickenfarm-list/yhchickenfarm-list.component';
import { yhchickenfarmDetailComponent } from './yhchickenfarm-detail/yhchickenfarm-detail.component';
import { ShowMapModule } from 'src/app/components/show-map/show-map.component';

@NgModule({
    imports: [
        CommonModule,
        yhchickenfarmRoutes,
        NxToolbarPanelModule,
        NxFormListModule,
        DxFormModule,
        DxButtonModule,
        DxTextBoxModule,
        DxSelectBoxModule,
        DxDateBoxModule,
        DxLoadPanelModule,
        DxTextAreaModule,
        NxExcelImportModule,
        NxHeaderSearchPanelModule,
        NzToolTipModule,
        DxDataGridModule,
        TranslateModule,
        DxPopupModule,
        ShowMapModule
    ],
    declarations: [yhchickenfarmListComponent, yhchickenfarmDetailComponent],
    providers: [yhchickenfarmService],
})
export class yhchickenfarmModule { }
