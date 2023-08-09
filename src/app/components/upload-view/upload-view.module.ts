import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadViewComponent } from './upload-view.component';
import { DxButtonModule, DxDataGridModule, DxPopupModule } from 'devextreme-angular';
import { DxLoadPanelModule } from 'devextreme-angular';
// import { EditorGridModule } from '../editor-grid';
// import { GridViewModule } from '../grid-view';
import { ViewContainerModule } from '../view-container/view-container.component';
import { UploadViewService } from './upload-view.service';


@NgModule({
    imports: [
        CommonModule, 
        DxPopupModule, 
        DxDataGridModule, 
        DxButtonModule, 
        DxLoadPanelModule,
        // EditorGridModule,
        // GridViewModule,
        ViewContainerModule
    ],
    declarations: [UploadViewComponent],
    exports: [UploadViewComponent],
    providers: [UploadViewService]
})
export class UploadViewModule { }
