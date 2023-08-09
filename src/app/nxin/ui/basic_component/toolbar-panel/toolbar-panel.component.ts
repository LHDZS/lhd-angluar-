import { Component, OnInit, NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule } from 'devextreme-angular';
import { NxToolbarPanel } from '../../extensions/basic/toolbar_panel';

@Component({
    selector: 'nx-toolbar-panel',
    templateUrl: './toolbar-panel.component.html',
    styleUrls: ['./toolbar-panel.component.css'],
})
export class NxToolbarPanelComponent implements OnInit {
    constructor() {}
    @Input()
    model: NxToolbarPanel;
    ngOnInit() {}
}

@NgModule({
    imports: [CommonModule, DxButtonModule],
    declarations: [NxToolbarPanelComponent],
    exports: [NxToolbarPanelComponent],
})
export class NxToolbarPanelModule {}
