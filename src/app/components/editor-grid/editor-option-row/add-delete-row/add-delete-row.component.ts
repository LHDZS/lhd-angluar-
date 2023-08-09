import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { EditorGridCommonService } from '../../editor-grid.service';

@Component({
    selector: 'add-delete',
    templateUrl: './add-delete-row.component.html',
    styleUrls: ['./add-delete-row.component.scss'],
})
export class AddDeleteComponent implements OnInit {
    /** 增行 */
    @Input()
    addEnabled: boolean = true;
    /** 删行 */
    @Input()
    deleteEnabled: boolean = true;
    /** 增行 */
    addRow: () => void;
    /** 删行 */
    deleteRow: () => void;
    constructor(private _common: EditorGridCommonService) {}

    get _editing() {
        return this._common.editing;
    }

    ngOnInit() {}

    addRowEvent() {
        if (this.addRow) this.addRow();
    }

    deleteRowEvent() {
        if (this.deleteRow) this.deleteRow();
    }
}
