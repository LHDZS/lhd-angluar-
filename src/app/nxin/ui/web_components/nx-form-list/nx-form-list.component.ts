import { Component, OnInit, Input, NgModule } from '@angular/core';
import { INxFormListComponent, NxFormListComponent } from '../../extensions/web/nx-form-list';
import { NxDataGridModule } from '../../basic_component/data-grid/data-grid.component';
import { NxReviewModule } from '../../../../components/review/review.component';
import { NxToolbarPanelModule } from '../../basic_component/toolbar-panel/toolbar-panel.component';

@Component({
    selector: 'nx-form-list',
    templateUrl: './nx-form-list.component.html',
    styleUrls: ['./nx-form-list.component.css'],
})
export class NxFormList implements OnInit, INxFormListComponent {
    @Input()
    model: NxFormListComponent;
    constructor() {}

    ngOnInit() {
        // 处理
    }
    set() {}
}

@NgModule({
    imports: [NxDataGridModule, NxReviewModule, NxToolbarPanelModule],
    exports: [NxFormList],
    declarations: [NxFormList],
})
export class NxFormListModule {}
