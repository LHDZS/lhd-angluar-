import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ContentChildren, NgModule, OnInit, QueryList,Input } from '@angular/core';
import { DxCheckBoxModule, DxDateBoxModule, DxNumberBoxModule, DxTextAreaModule, DxButtonModule } from 'devextreme-angular';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxTagBoxModule } from 'devextreme-angular/ui/tag-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { EditorHeaderGroupComponent } from './editor-header-group/editor-header-group.component';
import { EditorHeaderItemComponent } from './editor-header-item/editor-header-item.component';

@Component({
    selector: 'editor-header',
    templateUrl: './editor-header.component.html',
    styleUrls: ['./editor-header.component.scss'],
})
export class EditorHeaderComponent implements OnInit, AfterViewInit {
    @ContentChildren(EditorHeaderGroupComponent)
    _headerGroups: QueryList<EditorHeaderGroupComponent>;
    @Input()
    flexFlow: boolean = false;
    labType: false;
    @Input()
    title: any = null;
    private _cell_0_max_width: number = 0;
    private _cell_1_max_width: number = 0;
    private _cell_2_max_width: number = 0;
    @Input()
    HeaderVisible: boolean = true;
    @Input()
    labelHeight:any = 'auto';
    labelText: any = '收起';
    @Input()
    expressionType: boolean = false;
    offsetHeight: string;
    constructor() {}
    ngAfterViewInit(): void {
        this._headerGroups.forEach(g => {
            // setTimeout(() => {
            //     this.HeaderVisible = g.headerItem.num > 0;
            // }, 500);

            g._items.forEach((item, index) => {
                // console.log(item,'这是啥呀')
                let TARGET = '';
                if (index == 0) TARGET = '_cell_0_max_width';
                if (index == 1) TARGET = '_cell_1_max_width';
                if (index == 2) TARGET = '_cell_2_max_width';
                this[TARGET] = item._labelWidth > this[TARGET] ? item._labelWidth : this[TARGET];
            });
        });
        
        this._headerGroups.forEach(g => {
            g._items.forEach((item, inedx) => {
                if (item.labelVisible) {
                    if (inedx == 0) item._setLabelWidth(this._cell_0_max_width);
                    if (inedx == 1) item._setLabelWidth(this._cell_1_max_width);
                    if (inedx == 2) item._setLabelWidth(this._cell_2_max_width);
                }
            });
        });
    }
    ngOnInit() {
        
    }
    expansion() {
        // console.log(this._headerGroups)
        if (this.labelText == '展开') {
            this.labelText = '收起';
            this._headerGroups.last.labelHeight = this.offsetHeight;
        } else {
            this.offsetHeight = this._headerGroups.last.labelHeight;
            this.labelText = '展开'
            this._headerGroups.last.labelHeight = '0px';
        }
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [
        EditorHeaderComponent,
        EditorHeaderGroupComponent,
        EditorHeaderItemComponent,
        DxSelectBoxModule,
        DxTextBoxModule,
        DxTagBoxModule,
        DxDateBoxModule,
        DxTextAreaModule,
        DxCheckBoxModule,
        DxNumberBoxModule,
        DxButtonModule
    ],
    declarations: [EditorHeaderComponent, EditorHeaderGroupComponent, EditorHeaderItemComponent],
})
export class EditorHeaderModule {}
