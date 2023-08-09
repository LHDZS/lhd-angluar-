import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, NgModule, OnInit, Output, ViewChild } from '@angular/core';
import { DxTextAreaComponent, DxTextAreaModule } from 'devextreme-angular';

@Component({
    selector: 'editor-remark',
    templateUrl: './editor-remark.component.html',
    styleUrls: ['./editor-remark.component.scss'],
})
export class EditorRemarkComponent implements OnInit {
    /** 绑定的值 */
    @Input() value: string;
    /** 默认值 */
    @Input() defaultValue: any = undefined;
    /** 只读 */
    @Input() readOnly: boolean = false;
    /** 长度限制 */
    @Input() maxLength: number | string;
    @Output() valueChange = new EventEmitter();
    loaded: boolean = false;
    @ViewChild('textArea', { static: false })
    _textArea: DxTextAreaComponent;
    constructor() {}

    ngOnInit() {}

    _onValueChanged() {
        this.valueChange.emit(this.value);
    }
}

@NgModule({
    imports: [CommonModule, DxTextAreaModule],
    declarations: [EditorRemarkComponent],
    exports: [EditorRemarkComponent],
})
export class EditorRemarkModule {}
