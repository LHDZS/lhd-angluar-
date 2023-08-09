import { Component, NgModule, Input } from '@angular/core';
import { DxTextBoxModule, DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import { NxFormListHeaderPanelModel } from './nx-form-list-header-panel.extend';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'nx-form-list-header-panel',
    templateUrl: './nx-form-list-header-panel.component.html',
    styleUrls: ['./nx-form-list-header-panel.component.scss'],
})
export class NxFormListHeaderPanelComponent {
    constructor() {}
    @Input()
    model: NxFormListHeaderPanelModel;
    ngOnInit() {
    }
}
@NgModule({
    imports: [CommonModule, DxDataGridModule, DxTextBoxModule, DxButtonModule],
    exports: [NxFormListHeaderPanelComponent],
    declarations: [NxFormListHeaderPanelComponent],
})
export class NxFormListHeaderPanelModule {}
