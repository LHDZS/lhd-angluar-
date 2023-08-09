import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxTagBoxModule } from 'devextreme-angular/ui/tag-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { ComboxPanelComponent } from './combox-panel.component';
import { ComboxGroupModule } from './combox-group/combox-group.component';
import { ComboxItemModule } from './combox-item/combox-item.component';

@NgModule({
    imports: [CommonModule, DxButtonModule, ComboxGroupModule],
    exports: [
        ComboxPanelComponent,
        ComboxGroupModule,
        ComboxItemModule,
        DxSelectBoxModule,
        DxTextBoxModule,
        DxTagBoxModule,
        DxDateBoxModule,
    ],
    declarations: [ComboxPanelComponent],
})
export class ComboxPanelModule {}
