import {
    NgModule,
    AfterContentInit,
    Component,
    ContentChild,
    HostBinding,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { EditorOptionRowComponent } from '../../editor-option-row/editor-option-row.component';

@Component({
    selector: 'editor-grid-item',
    templateUrl: './editor-grid-item.component.html',
    styleUrls: ['./editor-grid-item.component.scss'],
    host: {
        active: 'active',
    },
})
export class EditorGridItemComponent implements OnInit, AfterContentInit {
    @ContentChild(DxDataGridComponent, { static: false })
    _dataGrid: DxDataGridComponent;
    @ContentChild(EditorOptionRowComponent, { static: false })
    _optionRow: EditorOptionRowComponent;
    
    /** 标题 */
    @Input()
    title: string;
    @Input()
    active: boolean = false;
    @Input()
    key: string;
    @Input()
    options: { text: string; key: string; visible: boolean; click?: () => void }[];
    constructor() {}
    ngOnInit() {}
    ngAfterContentInit(): void {}

}
