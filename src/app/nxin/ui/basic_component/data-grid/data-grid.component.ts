import { Component, OnInit, Input, NgModule } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { NxDataGrid } from '../../extensions/basic/data_grid';
import { NxDataGridImplements } from '../../extensions/basic/data_grid/_default';

@Component({
    selector: 'nx-data-grid',
    templateUrl: './data-grid.component.html',
    styleUrls: ['./data-grid.component.css'],
})
export class NxDataGridComponent implements OnInit {
    @Input()
    model: NxDataGrid;
    constructor() {}

    ngOnInit() {
        const obj = new NxDataGridImplements();
        this.model = Object.assign(obj, this.model);
    }

    onRowDblClickEvent(e) {
        // - before
        if (this.model.onRowDblClickBefore) {
            this.model.onRowDblClickBefore();
        }
        if (this.model.onRowDblClick) {
            // e
            this.model.onRowDblClick();
        }
        if (this.model.onRowDblClickAfter) {
            this.model.onRowDblClickAfter();
        }
        // - after
    }

    mergeArr(target, source) {
        var sourceIsArray = Array.isArray(source);
        var targetIsArray = Array.isArray(target);
        if ((sourceIsArray === targetIsArray) !== true) {
            throw new Error('必须都是数组');
        }
    }
}
@NgModule({
    imports: [CommonModule, DxDataGridModule],
    exports: [NxDataGridComponent],
    declarations: [NxDataGridComponent],
})
export class NxDataGridModule {}
