import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
} from '@angular/core';
import { ComboxGroupComponent } from './combox-group/combox-group.component';

@Component({
    selector: 'combox-panel',
    templateUrl: './combox-panel.component.html',
    styleUrls: ['./combox-panel.component.scss'],
})
export class ComboxPanelComponent implements OnInit, AfterContentInit, AfterViewInit {
    @ContentChildren(ComboxGroupComponent)
    _comboxGroup: QueryList<ComboxGroupComponent>;
    folder: boolean = false;
    foldActive: boolean = false;
    @Input()
    collapse: boolean = false;
    /** 控制重置按钮是否显示 */
    @Input()
    resetVisible: boolean = true;
    /** 控制重置按钮是否显示 */
    @Input()
    searchVisible: boolean = true;
    /** 折叠事件 */
    @Output()
    onFolding = new EventEmitter();
    /** 查询事件 */
    @Output()
    onSearch = new EventEmitter();
    /** 重置事件 */
    @Output()
    onReset = new EventEmitter();
    dynamicHeight: number = 50;
    private _cell_0_max_width: number = 0;
    private _cell_1_max_width: number = 0;
    private _cell_2_max_width: number = 0;
    constructor() {}
    ngAfterViewInit(): void {
        console.log("1",this._comboxGroup)
        this._comboxGroup.forEach(g => {
            g._items.forEach((item, index) => {
                let TARGET = '';
                if (index == 0) TARGET = '_cell_0_max_width';
                if (index == 1) TARGET = '_cell_1_max_width';
                if (index == 2) TARGET = '_cell_2_max_width';
                this[TARGET] = item._labelWidth > this[TARGET] ? item._labelWidth : this[TARGET];
            });
        });
        this._comboxGroup.forEach(g => {
            g._items.forEach((item, inedx) => {
                if (inedx == 0) item._setLabelWidth(this._cell_0_max_width);
                if (inedx == 1) item._setLabelWidth(this._cell_1_max_width);
                if (inedx == 2) item._setLabelWidth(this._cell_2_max_width);
            });
        });
    }
    ngAfterContentInit(): void {
        if (this.collapse) {
            this.folder = this._comboxGroup.length > 1;
        } else {
            this.dynamicHeight = 50 * this._comboxGroup.length;
        }
    }
    ngOnInit() {}
    /** 折叠 */
    folding() {
        this.foldActive = !this.foldActive;
        if (this.foldActive) {
            this.dynamicHeight = 50 * this._comboxGroup.length;
        } else {
            this.dynamicHeight = 50;
        }
        this.onFolding.emit({
            active: this.foldActive,
            height: this.dynamicHeight,
        });
    }
    /** 查询 */
    search() {
        this.onSearch.emit();
    }
    /** 重置 */
    reset() {
        this.onReset.emit();
    }
}
